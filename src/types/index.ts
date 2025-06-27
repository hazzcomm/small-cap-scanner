export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  lastUpdated: Date;
}

export interface Opportunity {
  id: string;
  symbol: string;
  type: 'sector_laggard' | 'oversold' | 'crypto_correlation' | 'earnings_surprise' | 'commodity_disconnect';
  score: number;
  aiAwareScore: number;
  description: string;
  triggers: string[];
  riskLevel: 'low' | 'medium' | 'high';
  targetPrice?: number;
  stopLoss?: number;
  timeframe: string;
  flaggedDate: Date;
  resolved?: boolean;
  actualReturn?: number;
}

export interface SectorData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  constituents: string[];
}

export interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  lastUpdated: Date;
}

export interface Portfolio {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  unrealizedPnL: number;
  sector: string;
  entryDate: Date;
}

export interface Alert {
  id: string;
  type: 'opportunity' | 'risk' | 'update';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  created: Date;
  read: boolean;
}