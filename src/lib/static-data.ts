// Static data storage for Netlify deployment
// This replaces the database for a simple, static version

interface StaticOpportunity {
  id: string;
  symbol: string;
  type: 'sector_laggard' | 'oversold' | 'crypto_correlation';
  score: number;
  aiAwareScore: number;
  description: string;
  triggers: string[];
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
  flaggedDate: string;
}

interface StaticAlert {
  id: string;
  type: 'opportunity' | 'risk' | 'update';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  created: string;
  read: boolean;
}

// Mock data for immediate deployment
export const staticOpportunities: StaticOpportunity[] = [
  {
    id: 'crypto_dcc_001',
    symbol: 'DCC.AX',
    type: 'crypto_correlation',
    score: 75,
    aiAwareScore: 89,
    description: 'DigitalX lagging Bitcoin by 8.5% over 2 days',
    triggers: [
      'Bitcoin up 12.3% in 2 days',
      'DCC.AX up only 3.8%',
      'Historical correlation: ~70%'
    ],
    riskLevel: 'medium',
    timeframe: '1-5 days',
    flaggedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'oversold_nva_001',
    symbol: 'NVA.AX',
    type: 'oversold',
    score: 68,
    aiAwareScore: 82,
    description: 'Nova Minerals oversold with 12.5% decline on high volume',
    triggers: [
      'Price down 12.5%',
      'Volume: 5.2M (3x average)',
      'No negative news identified'
    ],
    riskLevel: 'high',
    timeframe: '3-14 days',
    flaggedDate: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'sector_mem_001',
    symbol: 'MEM.AX',
    type: 'sector_laggard',
    score: 72,
    aiAwareScore: 85,
    description: 'Memphasys lagging Healthcare sector by 6.2%',
    triggers: [
      'Healthcare sector (XHJ) up 5.1%',
      'MEM.AX down 11.1%',
      'Relative lag: 16.2%'
    ],
    riskLevel: 'medium',
    timeframe: '2-10 days',
    flaggedDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'crypto_ebtc_001',
    symbol: 'EBTC.AX',
    type: 'crypto_correlation',
    score: 65,
    aiAwareScore: 78,
    description: 'Bitcoin ETF lagging Bitcoin by 6% over 24 hours',
    triggers: [
      'Bitcoin up 8.2% in 24h',
      'EBTC.AX up only 2.1%',
      'ETF premium compressed'
    ],
    riskLevel: 'low',
    timeframe: '1-3 days',
    flaggedDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'oversold_ffg_001',
    symbol: 'FFG.AX',
    type: 'oversold',
    score: 58,
    aiAwareScore: 71,
    description: 'Fatfish Group oversold in tech selloff',
    triggers: [
      'Price down 8.5%',
      'Tech sector down 3.2%',
      'Volume 2x average'
    ],
    riskLevel: 'high',
    timeframe: '5-15 days',
    flaggedDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

export const staticAlerts: StaticAlert[] = [
  {
    id: 'alert_001',
    type: 'opportunity',
    title: 'New High-Score Opportunity',
    message: 'DCC.AX crypto correlation opportunity scored 89/100',
    severity: 'info',
    created: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'alert_002',
    type: 'risk',
    title: 'High Volume Alert',
    message: 'NVA.AX trading 3x normal volume with -12.5% price drop',
    severity: 'warning',
    created: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'alert_003',
    type: 'update',
    title: 'Market Scan Complete',
    message: 'Found 5 opportunities. Top picks: DCC.AX, MEM.AX, EBTC.AX',
    severity: 'info',
    created: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true
  }
];

// Market summary data
export const staticMarketData = {
  asxAll: { change: 0.8, volume: '2.1B' },
  smallCaps: { change: -0.2, volume: '180M' },
  crypto: { btc: 2.3, eth: 1.8 },
  lastUpdated: new Date().toISOString()
};

// Helper functions
export function getActiveOpportunities(limit = 50): StaticOpportunity[] {
  return staticOpportunities
    .sort((a, b) => b.aiAwareScore - a.aiAwareScore)
    .slice(0, limit);
}

export function getUnreadAlerts(limit = 10): StaticAlert[] {
  return staticAlerts
    .filter(alert => !alert.read)
    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    .slice(0, limit);
}

export function getOpportunitiesByType(type: string): StaticOpportunity[] {
  return staticOpportunities.filter(opp => opp.type === type);
}

export function getOpportunitiesByRisk(riskLevel: string): StaticOpportunity[] {
  return staticOpportunities.filter(opp => opp.riskLevel === riskLevel);
}