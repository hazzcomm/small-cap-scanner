// Data source configurations and API integrations
export interface DataSourceConfig {
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: number; // requests per minute
  features: string[];
}

// Free/Low-cost ASX data sources
export const dataSources: Record<string, DataSourceConfig> = {
  yahooFinance: {
    name: 'Yahoo Finance',
    baseUrl: 'https://query1.finance.yahoo.com/v8/finance/chart',
    rateLimit: 2000, // Very generous
    features: ['real-time', 'historical', 'volume', 'basic-fundamentals']
  },
  
  alphaVantage: {
    name: 'Alpha Vantage',
    baseUrl: 'https://www.alphavantage.co/query',
    apiKey: process.env.ALPHA_VANTAGE_KEY,
    rateLimit: 5, // Free tier: 5 calls per minute
    features: ['real-time', 'historical', 'fundamentals', 'technical-indicators']
  },
  
  finnhub: {
    name: 'Finnhub',
    baseUrl: 'https://finnhub.io/api/v1',
    apiKey: process.env.FINNHUB_KEY,
    rateLimit: 60, // Free tier: 60 calls per minute
    features: ['real-time', 'news', 'earnings', 'insider-trading']
  },
  
  cryptoApi: {
    name: 'CoinGecko',
    baseUrl: 'https://api.coingecko.com/api/v3',
    rateLimit: 50, // Free tier: 50 calls per minute
    features: ['crypto-prices', 'historical-crypto']
  }
};

// ASX-specific symbol mappings
export const asxSymbols = {
  sectorETFs: {
    'XEJ': 'Energy',
    'XSJ': 'Consumer Staples', 
    'XMJ': 'Materials',
    'XDJ': 'Consumer Discretionary',
    'XIJ': 'Industrials',
    'XHJ': 'Healthcare',
    'XFJ': 'Financials',
    'XTJ': 'Technology',
    'XUJ': 'Utilities'
  },
  
  cryptoStocks: {
    'DCC.AX': 'DigitalX',
    'CRYP.AX': 'Crypto ETF',
    'EBTC.AX': 'Bitcoin ETF',
    'BTC.AX': 'Bitcoin Group'
  },
  
  // Small cap sectors to focus on
  targetSectors: [
    'Materials', 'Energy', 'Technology', 'Healthcare', 
    'Consumer Discretionary', 'Industrials'
  ]
};

// API rate limiting and caching
class RateLimiter {
  private calls: Map<string, number[]> = new Map();
  
  canMakeCall(source: string): boolean {
    const config = dataSources[source];
    if (!config) return false;
    
    const now = Date.now();
    const sourceHistory = this.calls.get(source) || [];
    
    // Remove calls older than 1 minute
    const recentCalls = sourceHistory.filter(time => now - time < 60000);
    
    if (recentCalls.length >= config.rateLimit) {
      return false;
    }
    
    recentCalls.push(now);
    this.calls.set(source, recentCalls);
    return true;
  }
  
  getWaitTime(source: string): number {
    const config = dataSources[source];
    if (!config) return 0;
    
    const sourceHistory = this.calls.get(source) || [];
    if (sourceHistory.length < config.rateLimit) return 0;
    
    const oldestCall = Math.min(...sourceHistory);
    return Math.max(0, 60000 - (Date.now() - oldestCall));
  }
}

export const rateLimiter = new RateLimiter();

// Fetch ASX stock data
export async function fetchAsxStock(symbol: string): Promise<any> {
  if (!rateLimiter.canMakeCall('yahooFinance')) {
    const waitTime = rateLimiter.getWaitTime('yahooFinance');
    throw new Error(`Rate limited. Wait ${waitTime}ms`);
  }
  
  const asxSymbol = symbol.endsWith('.AX') ? symbol : `${symbol}.AX`;
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

// Fetch crypto prices
export async function fetchCryptoPrice(symbol: string): Promise<any> {
  if (!rateLimiter.canMakeCall('cryptoApi')) {
    const waitTime = rateLimiter.getWaitTime('cryptoApi');
    throw new Error(`Rate limited. Wait ${waitTime}ms`);
  }
  
  const cryptoId = symbol.toLowerCase() === 'btc' ? 'bitcoin' : 'ethereum';
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

// Fetch sector ETF data
export async function fetchSectorETF(symbol: string): Promise<any> {
  return await fetchAsxStock(symbol);
}

// Market data validation
export function validateMarketData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Check for required fields
  const requiredFields = ['price', 'volume'];
  return requiredFields.every(field => 
    data.hasOwnProperty(field) && 
    typeof data[field] === 'number' && 
    !isNaN(data[field])
  );
}

// Convert Yahoo Finance data to our format
export function parseYahooFinanceData(data: any): any {
  try {
    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators.quote[0];
    
    return {
      symbol: meta.symbol,
      price: meta.regularMarketPrice,
      previousClose: meta.previousClose,
      change: meta.regularMarketPrice - meta.previousClose,
      changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
      volume: quote.volume[quote.volume.length - 1] || 0,
      marketCap: meta.marketCap || 0,
      currency: meta.currency
    };
  } catch (error) {
    console.error('Error parsing Yahoo Finance data:', error);
    throw new Error('Invalid data format');
  }
}