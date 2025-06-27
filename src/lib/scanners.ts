import { Stock, Opportunity, SectorData, CryptoData } from '../types/index';
import { SupabaseManager } from './supabase';
import { fetchAsxStock, fetchCryptoPrice, fetchSectorETF, parseYahooFinanceData } from './data-sources';

// AI-Aware Scoring System
export class AIAwareScoring {
  
  // Calculate base opportunity score (0-100)
  static calculateBaseScore(
    stockData: Stock,
    sectorData?: SectorData,
    triggerType?: string
  ): number {
    let score = 0;
    
    // Technical factors (40 points max)
    if (stockData.changePercent < -5) score += 15; // Oversold
    if (stockData.changePercent < -10) score += 10; // Heavily oversold
    if (stockData.volume > 1.5 * 100000) score += 10; // High volume
    if (stockData.marketCap >= 50000000 && stockData.marketCap <= 500000000) score += 5; // Target size
    
    // Sector relative performance (30 points max)
    if (sectorData) {
      const relativePeformance = stockData.changePercent - sectorData.changePercent;
      if (relativePeformance < -3) score += 15; // Lagging sector
      if (relativePeformance < -5) score += 10; // Significantly lagging
      if (sectorData.changePercent > 2 && stockData.changePercent < 0) score += 5; // Sector up, stock down
    }
    
    // Market cap efficiency (20 points max)
    if (stockData.marketCap < 200000000) score += 10; // Smaller caps
    if (stockData.marketCap < 100000000) score += 5; // Very small caps
    if (stockData.marketCap > 50000000) score += 5; // Not micro cap risk
    
    // Volatility and momentum (10 points max)
    if (Math.abs(stockData.changePercent) > 3) score += 5; // Volatile moves
    if (stockData.changePercent > -15 && stockData.changePercent < -3) score += 5; // Sweet spot oversold
    
    return Math.min(score, 100);
  }
  
  // AI-Aware adjustments to scoring
  static calculateAIAwareScore(baseScore: number, stockData: Stock, triggerType: string): number {
    let aiScore = baseScore;
    
    // Human advantage factors (increase score)
    
    // 1. Multi-day lag opportunities (AI focuses on intraday)
    if (triggerType === 'crypto_correlation' || triggerType === 'sector_laggard') {
      aiScore *= 1.3; // 30% boost for multi-day opportunities
    }
    
    // 2. Small cap blind spots (AI algorithms avoid illiquid stocks)
    if (stockData.marketCap < 150000000) {
      aiScore *= 1.2; // 20% boost for smaller caps
    }
    
    // 3. Cross-asset correlation (harder for single-asset AI to detect)
    if (triggerType === 'crypto_correlation' || triggerType === 'commodity_disconnect') {
      aiScore *= 1.25; // 25% boost for cross-asset plays
    }
    
    // 4. Emotional/sentiment gaps (fundamental vs technical divergence)
    if (triggerType === 'earnings_surprise' && stockData.changePercent < 0) {
      aiScore *= 1.4; // 40% boost for good news ignored
    }
    
    // AI disadvantage factors (decrease score)
    
    // 1. High frequency patterns (AI dominates these)
    if (Math.abs(stockData.changePercent) > 15) {
      aiScore *= 0.7; // 30% penalty for extreme moves (likely AI driven)
    }
    
    // 2. High volume with clear pattern (AI already acting)
    if (stockData.volume > 2 * 150000) { // 2x average volume
      aiScore *= 0.8; // 20% penalty for high volume
    }
    
    // 3. Large cap efficiency (AI advantages)
    if (stockData.marketCap > 300000000) {
      aiScore *= 0.9; // 10% penalty for larger caps
    }
    
    // 4. Technical pattern completion (AI faster at recognizing)
    if (triggerType === 'oversold' && stockData.changePercent < -20) {
      aiScore *= 0.8; // 20% penalty for obvious technical signals
    }
    
    // Time-decay factor (opportunities get stale)
    const hoursOld = 0; // Would calculate from data timestamp
    if (hoursOld > 24) {
      aiScore *= 0.9; // 10% penalty for day-old data
    }
    
    return Math.min(aiScore, 100);
  }
}

// Sector Laggard Scanner
export class SectorLaggardScanner {
  
  static async scan(): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];
    
    try {
      // Get sector ETF performance
      const sectorETFs = ['XEJ', 'XSJ', 'XMJ', 'XDJ', 'XIJ', 'XHJ', 'XFJ', 'XTJ'];
      const sectorPerformance: Record<string, SectorData> = {};
      
      for (const etf of sectorETFs) {
        try {
          const data = await fetchSectorETF(etf);
          const parsed = parseYahooFinanceData(data);
          
          sectorPerformance[etf] = {
            symbol: etf,
            name: this.getSectorName(etf),
            price: parsed.price,
            change: parsed.change,
            changePercent: parsed.changePercent,
            constituents: []
          };
        } catch (error) {
          console.warn(`Failed to fetch ${etf}:`, error);
        }
      }
      
      // Get small cap stocks and compare to their sectors
      const allStocks = await SupabaseManager.getAllStocks();
      const stocks = allStocks.filter(stock => 
        stock.marketCap >= 50000000 && 
        stock.marketCap <= 500000000
      );
      
      for (const stock of stocks) {
        const sectorETF = this.mapStockToSectorETF(stock.sector);
        const sectorData = sectorPerformance[sectorETF];
        
        if (!sectorData) continue;
        
        // Look for stocks lagging their sector by significant margin
        const relativeLag = stock.changePercent - sectorData.changePercent;
        
        if (relativeLag < -3 && sectorData.changePercent > 0) {
          const baseScore = AIAwareScoring.calculateBaseScore(stock, sectorData, 'sector_laggard');
          const aiScore = AIAwareScoring.calculateAIAwareScore(baseScore, stock, 'sector_laggard');
          
          if (aiScore > 60) { // Only high-quality opportunities
            opportunities.push({
              id: `lag_${stock.symbol}_${Date.now()}`,
              symbol: stock.symbol,
              type: 'sector_laggard',
              score: baseScore,
              aiAwareScore: aiScore,
              description: `${stock.name} lagging ${sectorData.name} sector by ${Math.abs(relativeLag).toFixed(1)}%`,
              triggers: [
                `Sector (${sectorETF}) up ${sectorData.changePercent.toFixed(1)}%`,
                `Stock down ${Math.abs(stock.changePercent).toFixed(1)}%`,
                `Relative lag: ${Math.abs(relativeLag).toFixed(1)}%`
              ],
              riskLevel: this.assessRiskLevel(aiScore, stock.marketCap),
              timeframe: '2-10 days',
              flaggedDate: new Date()
            });
          }
        }
      }
      
    } catch (error) {
      console.error('Sector laggard scan failed:', error);
    }
    
    return opportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
  }
  
  private static getSectorName(etfSymbol: string): string {
    const sectorMap: Record<string, string> = {
      'XEJ': 'Energy',
      'XSJ': 'Consumer Staples',
      'XMJ': 'Materials',
      'XDJ': 'Consumer Discretionary',
      'XIJ': 'Industrials',
      'XHJ': 'Healthcare',
      'XFJ': 'Financials',
      'XTJ': 'Technology'
    };
    return sectorMap[etfSymbol] || 'Unknown';
  }
  
  private static mapStockToSectorETF(sector: string): string {
    const mapping: Record<string, string> = {
      'Energy': 'XEJ',
      'Consumer Staples': 'XSJ',
      'Materials': 'XMJ',
      'Consumer Discretionary': 'XDJ',
      'Industrials': 'XIJ',
      'Healthcare': 'XHJ',
      'Financials': 'XFJ',
      'Technology': 'XTJ'
    };
    return mapping[sector] || 'XEJ'; // Default to energy
  }
  
  private static assessRiskLevel(score: number, marketCap: number): 'low' | 'medium' | 'high' {
    if (score > 80 && marketCap > 200000000) return 'low';
    if (score > 70 && marketCap > 100000000) return 'medium';
    return 'high';
  }
}

// Crypto Correlation Scanner
export class CryptoCorrelationScanner {
  
  static async scan(): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];
    
    try {
      // Get crypto prices
      const btcData = await fetchCryptoPrice('BTC');
      const ethData = await fetchCryptoPrice('ETH');
      
      // Get ASX crypto stocks
      const cryptoStocks = ['DCC.AX', 'CRYP.AX', 'EBTC.AX'];
      
      for (const symbol of cryptoStocks) {
        try {
          const stockData = await fetchAsxStock(symbol);
          const parsed = parseYahooFinanceData(stockData);
          
          const stock: Stock = {
            symbol: parsed.symbol,
            name: this.getCryptoStockName(symbol),
            price: parsed.price,
            change: parsed.change,
            changePercent: parsed.changePercent,
            volume: parsed.volume,
            marketCap: parsed.marketCap || 100000000, // Estimate if not available
            sector: 'Technology',
            lastUpdated: new Date()
          };
          
          // Check correlation with BTC/ETH
          const btcChange = btcData.bitcoin?.aud_24h_change || 0;
          const correlation = this.calculateCorrelationOpportunity(stock, btcChange);
          
          if (correlation.hasOpportunity) {
            const baseScore = AIAwareScoring.calculateBaseScore(stock, undefined, 'crypto_correlation');
            const aiScore = AIAwareScoring.calculateAIAwareScore(baseScore, stock, 'crypto_correlation');
            
            // Boost score for strong correlation opportunities
            const boostedScore = aiScore * correlation.strengthMultiplier;
            
            if (boostedScore > 55) {
              opportunities.push({
                id: `crypto_${stock.symbol}_${Date.now()}`,
                symbol: stock.symbol,
                type: 'crypto_correlation',
                score: baseScore,
                aiAwareScore: boostedScore,
                description: `${stock.name} lagging ${correlation.leadingAsset} by ${correlation.lagPercentage}%`,
                triggers: [
                  `${correlation.leadingAsset} moved ${correlation.leadingChange.toFixed(1)}%`,
                  `${stock.symbol} moved ${stock.changePercent.toFixed(1)}%`,
                  `Historical correlation: ${correlation.expectedCorrelation}`
                ],
                riskLevel: correlation.riskLevel,
                timeframe: '1-5 days',
                flaggedDate: new Date()
              });
            }
          }
          
        } catch (error) {
          console.warn(`Failed to process ${symbol}:`, error);
        }
      }
      
    } catch (error) {
      console.error('Crypto correlation scan failed:', error);
    }
    
    return opportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
  }
  
  private static getCryptoStockName(symbol: string): string {
    const names: Record<string, string> = {
      'DCC.AX': 'DigitalX',
      'CRYP.AX': 'Crypto ETF',
      'EBTC.AX': 'Bitcoin ETF'
    };
    return names[symbol] || symbol;
  }
  
  private static calculateCorrelationOpportunity(stock: Stock, btcChange: number) {
    // Simplified correlation analysis
    const expectedCorrelation = 0.7; // Assume 70% correlation
    const expectedStockChange = btcChange * expectedCorrelation;
    const actualLag = expectedStockChange - stock.changePercent;
    
    const hasOpportunity = Math.abs(actualLag) > 5; // 5% lag threshold
    const strengthMultiplier = Math.min(Math.abs(actualLag) / 10, 1.5); // Max 50% boost
    
    return {
      hasOpportunity,
      lagPercentage: actualLag.toFixed(1),
      leadingAsset: 'Bitcoin',
      leadingChange: btcChange,
      expectedCorrelation: '~70%',
      strengthMultiplier,
      riskLevel: Math.abs(actualLag) > 10 ? 'medium' : 'low' as 'low' | 'medium' | 'high'
    };
  }
}

// Technical Oversold Scanner
export class OversoldScanner {
  
  static async scan(): Promise<Opportunity[]> {
    const opportunities: Opportunity[] = [];
    
    const allStocks = await SupabaseManager.getAllStocks();
    const stocks = allStocks.filter(stock => 
      stock.marketCap >= 50000000 && 
      stock.marketCap <= 500000000 &&
      stock.changePercent < -5 && // At least 5% down
      stock.changePercent > -25   // Not catastrophically down
    );
    
    for (const stock of stocks) {
      const baseScore = AIAwareScoring.calculateBaseScore(stock, undefined, 'oversold');
      const aiScore = AIAwareScoring.calculateAIAwareScore(baseScore, stock, 'oversold');
      
      if (aiScore > 50) {
        opportunities.push({
          id: `oversold_${stock.symbol}_${Date.now()}`,
          symbol: stock.symbol,
          type: 'oversold',
          score: baseScore,
          aiAwareScore: aiScore,
          description: `${stock.name} oversold with ${Math.abs(stock.changePercent).toFixed(1)}% decline`,
          triggers: [
            `Price down ${Math.abs(stock.changePercent).toFixed(1)}%`,
            `Volume: ${stock.volume.toLocaleString()}`,
            `Market cap: $${(stock.marketCap / 1000000).toFixed(0)}M`
          ],
          riskLevel: this.assessOversoldRisk(stock),
          timeframe: '3-14 days',
          flaggedDate: new Date()
        });
      }
    }
    
    return opportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
  }
  
  private static assessOversoldRisk(stock: Stock): 'low' | 'medium' | 'high' {
    if (stock.changePercent > -10 && stock.marketCap > 200000000) return 'low';
    if (stock.changePercent > -15 && stock.marketCap > 100000000) return 'medium';
    return 'high';
  }
}

// Master Scanner Controller
export class OpportunityScanner {
  
  static async runAllScans(): Promise<Opportunity[]> {
    console.log('🔍 Starting comprehensive opportunity scan...');
    
    const allOpportunities: Opportunity[] = [];
    
    try {
      // Run all scanners in parallel for efficiency
      const [sectorOpportunities, cryptoOpportunities, oversoldOpportunities] = await Promise.all([
        SectorLaggardScanner.scan(),
        CryptoCorrelationScanner.scan(),
        OversoldScanner.scan()
      ]);
      
      allOpportunities.push(...sectorOpportunities);
      allOpportunities.push(...cryptoOpportunities);
      allOpportunities.push(...oversoldOpportunities);
      
      // Remove duplicates and save to database
      const uniqueOpportunities = this.deduplicateOpportunities(allOpportunities);
      
      for (const opportunity of uniqueOpportunities) {
        await SupabaseManager.saveOpportunity(opportunity);
      }
      
      console.log(`✅ Found ${uniqueOpportunities.length} opportunities`);
      return uniqueOpportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
      
    } catch (error) {
      console.error('❌ Scan failed:', error);
      return [];
    }
  }
  
  private static deduplicateOpportunities(opportunities: Opportunity[]): Opportunity[] {
    const seen = new Set<string>();
    return opportunities.filter(opp => {
      const key = `${opp.symbol}_${opp.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}