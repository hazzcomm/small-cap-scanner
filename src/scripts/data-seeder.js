// Development data seeder for testing
import Database from 'better-sqlite3';

// Initialize database directly for seeding
const database = new Database('./database/scanner.db');

// Simple database operations for seeding
const db = {
  upsertStock: (stock) => {
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO stocks 
      (symbol, name, price, change_amount, change_percent, volume, market_cap, sector, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      stock.symbol,
      stock.name,
      stock.price,
      stock.change,
      stock.changePercent,
      stock.volume,
      stock.marketCap,
      stock.sector,
      stock.lastUpdated.toISOString()
    );
  },
  
  saveOpportunity: (opportunity) => {
    const stmt = database.prepare(`
      INSERT OR REPLACE INTO opportunities 
      (id, symbol, type, score, ai_aware_score, description, triggers, risk_level, 
       target_price, stop_loss, timeframe, flagged_date, resolved, actual_return)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      opportunity.id,
      opportunity.symbol,
      opportunity.type,
      opportunity.score,
      opportunity.aiAwareScore,
      opportunity.description,
      JSON.stringify(opportunity.triggers),
      opportunity.riskLevel,
      opportunity.targetPrice || null,
      opportunity.stopLoss || null,
      opportunity.timeframe,
      opportunity.flaggedDate.toISOString(),
      opportunity.resolved || false,
      opportunity.actualReturn || null
    );
  },
  
  saveAlert: (alert) => {
    const stmt = database.prepare(`
      INSERT INTO alerts (id, type, title, message, severity, created, read)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      alert.id,
      alert.type,
      alert.title,
      alert.message,
      alert.severity,
      alert.created.toISOString(),
      alert.read
    );
  }
};

// Initialize tables
function initTables() {
  // Create database directory
  const fs = require('fs');
  if (!fs.existsSync('./database')) {
    fs.mkdirSync('./database');
  }
  
  // Stocks table
  database.exec(`
    CREATE TABLE IF NOT EXISTS stocks (
      symbol TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      change_amount REAL NOT NULL,
      change_percent REAL NOT NULL,
      volume INTEGER NOT NULL,
      market_cap INTEGER NOT NULL,
      sector TEXT NOT NULL,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Opportunities table
  database.exec(`
    CREATE TABLE IF NOT EXISTS opportunities (
      id TEXT PRIMARY KEY,
      symbol TEXT NOT NULL,
      type TEXT NOT NULL,
      score REAL NOT NULL,
      ai_aware_score REAL NOT NULL,
      description TEXT NOT NULL,
      triggers TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      target_price REAL,
      stop_loss REAL,
      timeframe TEXT NOT NULL,
      flagged_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      resolved BOOLEAN DEFAULT FALSE,
      actual_return REAL,
      FOREIGN KEY (symbol) REFERENCES stocks (symbol)
    )
  `);

  // Alerts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT NOT NULL,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      read BOOLEAN DEFAULT FALSE
    )
  `);
}

// Mock ASX small cap stocks for development
const mockStocks = [
  {
    symbol: 'DCC.AX',
    name: 'DigitalX Ltd',
    price: 0.045,
    change: -0.002,
    changePercent: -4.26,
    volume: 2150000,
    marketCap: 85000000,
    sector: 'Technology',
    lastUpdated: new Date()
  },
  {
    symbol: 'LTR.AX',
    name: 'Liontown Resources',
    price: 1.23,
    change: 0.08,
    changePercent: 6.96,
    volume: 890000,
    marketCap: 280000000,
    sector: 'Materials',
    lastUpdated: new Date()
  },
  {
    symbol: 'NVA.AX',
    name: 'Nova Minerals',
    price: 0.021,
    change: -0.003,
    changePercent: -12.5,
    volume: 5200000,
    marketCap: 45000000,
    sector: 'Materials',
    lastUpdated: new Date()
  },
  {
    symbol: 'FFG.AX',
    name: 'Fatfish Group',
    price: 0.018,
    change: -0.001,
    changePercent: -5.26,
    volume: 1800000,
    marketCap: 35000000,
    sector: 'Technology',
    lastUpdated: new Date()
  },
  {
    symbol: 'MEM.AX',
    name: 'Memphasys Limited',
    price: 0.32,
    change: -0.04,
    changePercent: -11.11,
    volume: 450000,
    marketCap: 75000000,
    sector: 'Healthcare',
    lastUpdated: new Date()
  },
  {
    symbol: 'QFE.AX',
    name: 'QFE Resources',
    price: 0.089,
    change: -0.008,
    changePercent: -8.25,
    volume: 680000,
    marketCap: 125000000,
    sector: 'Energy',
    lastUpdated: new Date()
  },
  {
    symbol: 'CHK.AX',
    name: 'Chesser Resources',
    price: 0.052,
    change: 0.003,
    changePercent: 6.12,
    volume: 920000,
    marketCap: 95000000,
    sector: 'Materials',
    lastUpdated: new Date()
  },
  {
    symbol: 'ARL.AX',
    name: 'Ardea Resources',
    price: 0.145,
    change: -0.012,
    changePercent: -7.64,
    volume: 1200000,
    marketCap: 185000000,
    sector: 'Materials',
    lastUpdated: new Date()
  }
];

// Sample opportunities
const mockOpportunities = [
  {
    id: 'lag_DCC_1703691234567',
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
    flaggedDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    resolved: false
  },
  {
    id: 'oversold_NVA_1703691234568',
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
    flaggedDate: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    resolved: false
  },
  {
    id: 'sector_MEM_1703691234569',
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
    flaggedDate: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    resolved: false
  }
];

// Sample alerts
const mockAlerts = [
  {
    id: 'alert_1703691234570',
    type: 'opportunity',
    title: 'New High-Score Opportunity',
    message: 'DCC.AX crypto correlation opportunity scored 89/100',
    severity: 'info',
    created: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false
  },
  {
    id: 'alert_1703691234571',
    type: 'risk',
    title: 'High Volume Alert',
    message: 'NVA.AX trading 3x normal volume with -12.5% price drop',
    severity: 'warning',
    created: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    read: false
  },
  {
    id: 'alert_1703691234572',
    type: 'update',
    title: 'Market Scan Complete',
    message: 'Found 8 opportunities. Top picks: DCC.AX, MEM.AX, NVA.AX',
    severity: 'info',
    created: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: true
  }
];

function seedDatabase() {
  console.log('🌱 Seeding database with development data...');
  
  try {
    // Initialize tables first
    initTables();
    
    // Seed stocks
    mockStocks.forEach(stock => {
      db.upsertStock(stock);
    });
    console.log(`✅ Added ${mockStocks.length} mock stocks`);
    
    // Seed opportunities
    mockOpportunities.forEach(opportunity => {
      db.saveOpportunity(opportunity);
    });
    console.log(`✅ Added ${mockOpportunities.length} mock opportunities`);
    
    // Seed alerts
    mockAlerts.forEach(alert => {
      db.saveAlert(alert);
    });
    console.log(`✅ Added ${mockAlerts.length} mock alerts`);
    
    console.log('🎉 Database seeding complete!');
    database.close();
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    database.close();
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };