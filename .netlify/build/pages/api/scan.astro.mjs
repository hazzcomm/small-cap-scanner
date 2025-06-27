import { S as SupabaseManager } from '../../chunks/supabase_DyqbeQF5.mjs';
export { renderers } from '../../renderers.mjs';

const dataSources = {
  yahooFinance: {
    name: "Yahoo Finance",
    baseUrl: "https://query1.finance.yahoo.com/v8/finance/chart",
    rateLimit: 2e3,
    // Very generous
    features: ["real-time", "historical", "volume", "basic-fundamentals"]
  },
  alphaVantage: {
    name: "Alpha Vantage",
    baseUrl: "https://www.alphavantage.co/query",
    apiKey: process.env.ALPHA_VANTAGE_KEY,
    rateLimit: 5,
    // Free tier: 5 calls per minute
    features: ["real-time", "historical", "fundamentals", "technical-indicators"]
  },
  finnhub: {
    name: "Finnhub",
    baseUrl: "https://finnhub.io/api/v1",
    apiKey: process.env.FINNHUB_KEY,
    rateLimit: 60,
    // Free tier: 60 calls per minute
    features: ["real-time", "news", "earnings", "insider-trading"]
  },
  cryptoApi: {
    name: "CoinGecko",
    baseUrl: "https://api.coingecko.com/api/v3",
    rateLimit: 50,
    // Free tier: 50 calls per minute
    features: ["crypto-prices", "historical-crypto"]
  }
};
class RateLimiter {
  calls = /* @__PURE__ */ new Map();
  canMakeCall(source) {
    const config = dataSources[source];
    if (!config) return false;
    const now = Date.now();
    const sourceHistory = this.calls.get(source) || [];
    const recentCalls = sourceHistory.filter((time) => now - time < 6e4);
    if (recentCalls.length >= config.rateLimit) {
      return false;
    }
    recentCalls.push(now);
    this.calls.set(source, recentCalls);
    return true;
  }
  getWaitTime(source) {
    const config = dataSources[source];
    if (!config) return 0;
    const sourceHistory = this.calls.get(source) || [];
    if (sourceHistory.length < config.rateLimit) return 0;
    const oldestCall = Math.min(...sourceHistory);
    return Math.max(0, 6e4 - (Date.now() - oldestCall));
  }
}
const rateLimiter = new RateLimiter();
async function fetchAsxStock(symbol) {
  if (!rateLimiter.canMakeCall("yahooFinance")) {
    const waitTime = rateLimiter.getWaitTime("yahooFinance");
    throw new Error(`Rate limited. Wait ${waitTime}ms`);
  }
  const asxSymbol = symbol.endsWith(".AX") ? symbol : `${symbol}.AX`;
  const url = `${dataSources.yahooFinance.baseUrl}/${asxSymbol}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${asxSymbol}:`, error);
    throw error;
  }
}
async function fetchCryptoPrice(symbol) {
  if (!rateLimiter.canMakeCall("cryptoApi")) {
    const waitTime = rateLimiter.getWaitTime("cryptoApi");
    throw new Error(`Rate limited. Wait ${waitTime}ms`);
  }
  const cryptoId = symbol.toLowerCase() === "btc" ? "bitcoin" : "ethereum";
  const url = `${dataSources.cryptoApi.baseUrl}/simple/price?ids=${cryptoId}&vs_currencies=aud&include_24hr_change=true`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${symbol}:`, error);
    throw error;
  }
}
async function fetchSectorETF(symbol) {
  return await fetchAsxStock(symbol);
}
function parseYahooFinanceData(data) {
  try {
    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];
    return {
      symbol: meta.symbol,
      price: meta.regularMarketPrice,
      previousClose: meta.previousClose,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent: (meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100,
      volume: quote.volume[quote.volume.length - 1] || 0,
      marketCap: meta.marketCap || 0,
      currency: meta.currency
    };
  } catch (error) {
    console.error("Error parsing Yahoo Finance data:", error);
    throw new Error("Invalid data format");
  }
}

class AIAwareScoring {
  // Calculate base opportunity score (0-100)
  static calculateBaseScore(stockData, sectorData, triggerType) {
    let score = 0;
    if (stockData.changePercent < -5) score += 15;
    if (stockData.changePercent < -10) score += 10;
    if (stockData.volume > 1.5 * 1e5) score += 10;
    if (stockData.marketCap >= 5e7 && stockData.marketCap <= 5e8) score += 5;
    if (sectorData) {
      const relativePeformance = stockData.changePercent - sectorData.changePercent;
      if (relativePeformance < -3) score += 15;
      if (relativePeformance < -5) score += 10;
      if (sectorData.changePercent > 2 && stockData.changePercent < 0) score += 5;
    }
    if (stockData.marketCap < 2e8) score += 10;
    if (stockData.marketCap < 1e8) score += 5;
    if (stockData.marketCap > 5e7) score += 5;
    if (Math.abs(stockData.changePercent) > 3) score += 5;
    if (stockData.changePercent > -15 && stockData.changePercent < -3) score += 5;
    return Math.min(score, 100);
  }
  // AI-Aware adjustments to scoring
  static calculateAIAwareScore(baseScore, stockData, triggerType) {
    let aiScore = baseScore;
    if (triggerType === "crypto_correlation" || triggerType === "sector_laggard") {
      aiScore *= 1.3;
    }
    if (stockData.marketCap < 15e7) {
      aiScore *= 1.2;
    }
    if (triggerType === "crypto_correlation" || triggerType === "commodity_disconnect") {
      aiScore *= 1.25;
    }
    if (triggerType === "earnings_surprise" && stockData.changePercent < 0) {
      aiScore *= 1.4;
    }
    if (Math.abs(stockData.changePercent) > 15) {
      aiScore *= 0.7;
    }
    if (stockData.volume > 2 * 15e4) {
      aiScore *= 0.8;
    }
    if (stockData.marketCap > 3e8) {
      aiScore *= 0.9;
    }
    if (triggerType === "oversold" && stockData.changePercent < -20) {
      aiScore *= 0.8;
    }
    return Math.min(aiScore, 100);
  }
}
class SectorLaggardScanner {
  static async scan() {
    const opportunities = [];
    try {
      const sectorETFs = ["XEJ", "XSJ", "XMJ", "XDJ", "XIJ", "XHJ", "XFJ", "XTJ"];
      const sectorPerformance = {};
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
      const allStocks = await SupabaseManager.getAllStocks();
      const stocks = allStocks.filter(
        (stock) => stock.marketCap >= 5e7 && stock.marketCap <= 5e8
      );
      for (const stock of stocks) {
        const sectorETF = this.mapStockToSectorETF(stock.sector);
        const sectorData = sectorPerformance[sectorETF];
        if (!sectorData) continue;
        const relativeLag = stock.changePercent - sectorData.changePercent;
        if (relativeLag < -3 && sectorData.changePercent > 0) {
          const baseScore = AIAwareScoring.calculateBaseScore(stock, sectorData, "sector_laggard");
          const aiScore = AIAwareScoring.calculateAIAwareScore(baseScore, stock, "sector_laggard");
          if (aiScore > 60) {
            opportunities.push({
              id: `lag_${stock.symbol}_${Date.now()}`,
              symbol: stock.symbol,
              type: "sector_laggard",
              score: baseScore,
              aiAwareScore: aiScore,
              description: `${stock.name} lagging ${sectorData.name} sector by ${Math.abs(relativeLag).toFixed(1)}%`,
              triggers: [
                `Sector (${sectorETF}) up ${sectorData.changePercent.toFixed(1)}%`,
                `Stock down ${Math.abs(stock.changePercent).toFixed(1)}%`,
                `Relative lag: ${Math.abs(relativeLag).toFixed(1)}%`
              ],
              riskLevel: this.assessRiskLevel(aiScore, stock.marketCap),
              timeframe: "2-10 days",
              flaggedDate: /* @__PURE__ */ new Date()
            });
          }
        }
      }
    } catch (error) {
      console.error("Sector laggard scan failed:", error);
    }
    return opportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
  }
  static getSectorName(etfSymbol) {
    const sectorMap = {
      "XEJ": "Energy",
      "XSJ": "Consumer Staples",
      "XMJ": "Materials",
      "XDJ": "Consumer Discretionary",
      "XIJ": "Industrials",
      "XHJ": "Healthcare",
      "XFJ": "Financials",
      "XTJ": "Technology"
    };
    return sectorMap[etfSymbol] || "Unknown";
  }
  static mapStockToSectorETF(sector) {
    const mapping = {
      "Energy": "XEJ",
      "Consumer Staples": "XSJ",
      "Materials": "XMJ",
      "Consumer Discretionary": "XDJ",
      "Industrials": "XIJ",
      "Healthcare": "XHJ",
      "Financials": "XFJ",
      "Technology": "XTJ"
    };
    return mapping[sector] || "XEJ";
  }
  static assessRiskLevel(score, marketCap) {
    if (score > 80 && marketCap > 2e8) return "low";
    if (score > 70 && marketCap > 1e8) return "medium";
    return "high";
  }
}
class CryptoCorrelationScanner {
  static async scan() {
    const opportunities = [];
    try {
      const btcData = await fetchCryptoPrice("BTC");
      const ethData = await fetchCryptoPrice("ETH");
      const cryptoStocks = ["DCC.AX", "CRYP.AX", "EBTC.AX"];
      for (const symbol of cryptoStocks) {
        try {
          const stockData = await fetchAsxStock(symbol);
          const parsed = parseYahooFinanceData(stockData);
          const stock = {
            symbol: parsed.symbol,
            name: this.getCryptoStockName(symbol),
            price: parsed.price,
            change: parsed.change,
            changePercent: parsed.changePercent,
            volume: parsed.volume,
            marketCap: parsed.marketCap || 1e8,
            // Estimate if not available
            sector: "Technology",
            lastUpdated: /* @__PURE__ */ new Date()
          };
          const btcChange = btcData.bitcoin?.aud_24h_change || 0;
          const correlation = this.calculateCorrelationOpportunity(stock, btcChange);
          if (correlation.hasOpportunity) {
            const baseScore = AIAwareScoring.calculateBaseScore(stock, void 0, "crypto_correlation");
            const aiScore = AIAwareScoring.calculateAIAwareScore(baseScore, stock, "crypto_correlation");
            const boostedScore = aiScore * correlation.strengthMultiplier;
            if (boostedScore > 55) {
              opportunities.push({
                id: `crypto_${stock.symbol}_${Date.now()}`,
                symbol: stock.symbol,
                type: "crypto_correlation",
                score: baseScore,
                aiAwareScore: boostedScore,
                description: `${stock.name} lagging ${correlation.leadingAsset} by ${correlation.lagPercentage}%`,
                triggers: [
                  `${correlation.leadingAsset} moved ${correlation.leadingChange.toFixed(1)}%`,
                  `${stock.symbol} moved ${stock.changePercent.toFixed(1)}%`,
                  `Historical correlation: ${correlation.expectedCorrelation}`
                ],
                riskLevel: correlation.riskLevel,
                timeframe: "1-5 days",
                flaggedDate: /* @__PURE__ */ new Date()
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to process ${symbol}:`, error);
        }
      }
    } catch (error) {
      console.error("Crypto correlation scan failed:", error);
    }
    return opportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
  }
  static getCryptoStockName(symbol) {
    const names = {
      "DCC.AX": "DigitalX",
      "CRYP.AX": "Crypto ETF",
      "EBTC.AX": "Bitcoin ETF"
    };
    return names[symbol] || symbol;
  }
  static calculateCorrelationOpportunity(stock, btcChange) {
    const expectedCorrelation = 0.7;
    const expectedStockChange = btcChange * expectedCorrelation;
    const actualLag = expectedStockChange - stock.changePercent;
    const hasOpportunity = Math.abs(actualLag) > 5;
    const strengthMultiplier = Math.min(Math.abs(actualLag) / 10, 1.5);
    return {
      hasOpportunity,
      lagPercentage: actualLag.toFixed(1),
      leadingAsset: "Bitcoin",
      leadingChange: btcChange,
      expectedCorrelation: "~70%",
      strengthMultiplier,
      riskLevel: Math.abs(actualLag) > 10 ? "medium" : "low"
    };
  }
}
class OversoldScanner {
  static async scan() {
    const opportunities = [];
    const allStocks = await SupabaseManager.getAllStocks();
    const stocks = allStocks.filter(
      (stock) => stock.marketCap >= 5e7 && stock.marketCap <= 5e8 && stock.changePercent < -5 && // At least 5% down
      stock.changePercent > -25
      // Not catastrophically down
    );
    for (const stock of stocks) {
      const baseScore = AIAwareScoring.calculateBaseScore(stock, void 0, "oversold");
      const aiScore = AIAwareScoring.calculateAIAwareScore(baseScore, stock, "oversold");
      if (aiScore > 50) {
        opportunities.push({
          id: `oversold_${stock.symbol}_${Date.now()}`,
          symbol: stock.symbol,
          type: "oversold",
          score: baseScore,
          aiAwareScore: aiScore,
          description: `${stock.name} oversold with ${Math.abs(stock.changePercent).toFixed(1)}% decline`,
          triggers: [
            `Price down ${Math.abs(stock.changePercent).toFixed(1)}%`,
            `Volume: ${stock.volume.toLocaleString()}`,
            `Market cap: $${(stock.marketCap / 1e6).toFixed(0)}M`
          ],
          riskLevel: this.assessOversoldRisk(stock),
          timeframe: "3-14 days",
          flaggedDate: /* @__PURE__ */ new Date()
        });
      }
    }
    return opportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
  }
  static assessOversoldRisk(stock) {
    if (stock.changePercent > -10 && stock.marketCap > 2e8) return "low";
    if (stock.changePercent > -15 && stock.marketCap > 1e8) return "medium";
    return "high";
  }
}
class OpportunityScanner {
  static async runAllScans() {
    console.log("🔍 Starting comprehensive opportunity scan...");
    const allOpportunities = [];
    try {
      const [sectorOpportunities, cryptoOpportunities, oversoldOpportunities] = await Promise.all([
        SectorLaggardScanner.scan(),
        CryptoCorrelationScanner.scan(),
        OversoldScanner.scan()
      ]);
      allOpportunities.push(...sectorOpportunities);
      allOpportunities.push(...cryptoOpportunities);
      allOpportunities.push(...oversoldOpportunities);
      const uniqueOpportunities = this.deduplicateOpportunities(allOpportunities);
      for (const opportunity of uniqueOpportunities) {
        await SupabaseManager.saveOpportunity(opportunity);
      }
      console.log(`✅ Found ${uniqueOpportunities.length} opportunities`);
      return uniqueOpportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore);
    } catch (error) {
      console.error("❌ Scan failed:", error);
      return [];
    }
  }
  static deduplicateOpportunities(opportunities) {
    const seen = /* @__PURE__ */ new Set();
    return opportunities.filter((opp) => {
      const key = `${opp.symbol}_${opp.type}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

const POST = async ({ request }) => {
  try {
    console.log("🚀 Starting market scan...");
    const opportunities = await OpportunityScanner.runAllScans();
    if (opportunities.length > 0) {
      const topOpportunities = opportunities.slice(0, 3);
      const alertMessage = `Found ${opportunities.length} opportunities. Top picks: ${topOpportunities.map((o) => o.symbol).join(", ")}`;
      await SupabaseManager.saveAlert({
        id: `scan_${Date.now()}`,
        type: "opportunity",
        title: "Market Scan Complete",
        message: alertMessage,
        severity: "info",
        created: /* @__PURE__ */ new Date(),
        read: false
      });
    }
    return new Response(JSON.stringify({
      success: true,
      opportunities: opportunities.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("❌ Scan failed:", error);
    await SupabaseManager.saveAlert({
      id: `error_${Date.now()}`,
      type: "risk",
      title: "Scan Failed",
      message: `Market scan encountered an error: ${error instanceof Error ? error.message : "Unknown error"}`,
      severity: "warning",
      created: /* @__PURE__ */ new Date(),
      read: false
    });
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
