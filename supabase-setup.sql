-- Small Cap Scanner - Supabase Database Setup
-- Run these commands in your Supabase SQL Editor

-- Create stocks table
CREATE TABLE IF NOT EXISTS stocks (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  change_amount DECIMAL(10,4) NOT NULL,
  change_percent DECIMAL(8,4) NOT NULL,
  volume BIGINT NOT NULL,
  market_cap BIGINT NOT NULL,
  sector TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sector_laggard', 'oversold', 'crypto_correlation', 'earnings_surprise', 'commodity_disconnect')),
  score DECIMAL(5,2) NOT NULL,
  ai_aware_score DECIMAL(5,2) NOT NULL,
  description TEXT NOT NULL,
  triggers JSONB NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  target_price DECIMAL(10,4),
  stop_loss DECIMAL(10,4),
  timeframe TEXT NOT NULL,
  flagged_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  actual_return DECIMAL(8,4),
  FOREIGN KEY (symbol) REFERENCES stocks (symbol) ON DELETE CASCADE
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('opportunity', 'risk', 'update')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  created TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Create portfolio table for position tracking
CREATE TABLE IF NOT EXISTS portfolio (
  symbol TEXT PRIMARY KEY,
  quantity DECIMAL(12,4) NOT NULL,
  avg_price DECIMAL(10,4) NOT NULL,
  current_price DECIMAL(10,4) NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  unrealized_pnl DECIMAL(15,2) NOT NULL,
  sector TEXT NOT NULL,
  entry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  FOREIGN KEY (symbol) REFERENCES stocks (symbol) ON DELETE CASCADE
);

-- Create price_history table for trend analysis
CREATE TABLE IF NOT EXISTS price_history (
  symbol TEXT NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  volume BIGINT NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (symbol, date),
  FOREIGN KEY (symbol) REFERENCES stocks (symbol) ON DELETE CASCADE
);

-- Create sector_etfs table
CREATE TABLE IF NOT EXISTS sector_etfs (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,4) NOT NULL,
  change_percent DECIMAL(8,4) NOT NULL,
  constituents JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crypto_data table
CREATE TABLE IF NOT EXISTS crypto_data (
  symbol TEXT PRIMARY KEY,
  price DECIMAL(15,8) NOT NULL,
  change_24h DECIMAL(15,8) NOT NULL,
  change_percent_24h DECIMAL(8,4) NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_opportunities_symbol ON opportunities(symbol);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_ai_score ON opportunities(ai_aware_score DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_flagged_date ON opportunities(flagged_date DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_resolved ON opportunities(resolved);

CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);

CREATE INDEX IF NOT EXISTS idx_stocks_market_cap ON stocks(market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
CREATE INDEX IF NOT EXISTS idx_stocks_change_percent ON stocks(change_percent);

CREATE INDEX IF NOT EXISTS idx_price_history_date ON price_history(date DESC);

-- Row Level Security (RLS) policies
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sector_etfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_data ENABLE ROW LEVEL SECURITY;

-- Allow read access for all authenticated users
CREATE POLICY "Allow read access for all users" ON stocks FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON alerts FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON portfolio FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON price_history FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON sector_etfs FOR SELECT USING (true);
CREATE POLICY "Allow read access for all users" ON crypto_data FOR SELECT USING (true);

-- Allow insert/update for service role (for Netlify Functions)
CREATE POLICY "Allow service role full access" ON stocks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON opportunities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON alerts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON portfolio FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON price_history FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON sector_etfs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access" ON crypto_data FOR ALL USING (auth.role() = 'service_role');

-- Sample data for testing
INSERT INTO stocks (symbol, name, price, change_amount, change_percent, volume, market_cap, sector) VALUES
('DCC.AX', 'DigitalX Ltd', 0.045, -0.002, -4.26, 2150000, 85000000, 'Technology'),
('LTR.AX', 'Liontown Resources', 1.23, 0.08, 6.96, 890000, 280000000, 'Materials'),
('NVA.AX', 'Nova Minerals', 0.021, -0.003, -12.5, 5200000, 45000000, 'Materials'),
('FFG.AX', 'Fatfish Group', 0.018, -0.001, -5.26, 1800000, 35000000, 'Technology'),
('MEM.AX', 'Memphasys Limited', 0.32, -0.04, -11.11, 450000, 75000000, 'Healthcare'),
('QFE.AX', 'QFE Resources', 0.089, -0.008, -8.25, 680000, 125000000, 'Energy'),
('CHK.AX', 'Chesser Resources', 0.052, 0.003, 6.12, 920000, 95000000, 'Materials'),
('ARL.AX', 'Ardea Resources', 0.145, -0.012, -7.64, 1200000, 185000000, 'Materials')
ON CONFLICT (symbol) DO NOTHING;

-- Insert sample sector ETFs
INSERT INTO sector_etfs (symbol, name, price, change_percent, constituents) VALUES
('XEJ', 'Energy ETF', 45.67, 2.3, '["WDS.AX", "STO.AX", "ORG.AX"]'),
('XMJ', 'Materials ETF', 78.90, 1.8, '["BHP.AX", "RIO.AX", "FMG.AX"]'),
('XTJ', 'Technology ETF', 123.45, -0.5, '["CPU.AX", "XRO.AX", "APT.AX"]'),
('XHJ', 'Healthcare ETF', 89.12, 1.2, '["CSL.AX", "COH.AX", "SHL.AX"]')
ON CONFLICT (symbol) DO NOTHING;

-- Insert sample crypto data
INSERT INTO crypto_data (symbol, price, change_24h, change_percent_24h) VALUES
('BTC', 67500.00, 1500.00, 2.27),
('ETH', 3800.00, 65.00, 1.74)
ON CONFLICT (symbol) DO NOTHING;

-- Create a view for dashboard summary
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
  (SELECT COUNT(*) FROM opportunities WHERE resolved = false) as active_opportunities,
  (SELECT COUNT(*) FROM alerts WHERE read = false) as unread_alerts,
  (SELECT AVG(ai_aware_score) FROM opportunities WHERE resolved = false) as avg_ai_score,
  (SELECT COUNT(*) FROM stocks) as total_stocks_tracked,
  (SELECT MAX(last_updated) FROM stocks) as last_data_update;

-- Create a function to clean old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Delete resolved opportunities older than 30 days
  DELETE FROM opportunities 
  WHERE resolved = true 
  AND flagged_date < NOW() - INTERVAL '30 days';
  
  -- Delete read alerts older than 7 days
  DELETE FROM alerts 
  WHERE read = true 
  AND created < NOW() - INTERVAL '7 days';
  
  -- Delete price history older than 1 year
  DELETE FROM price_history 
  WHERE date < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create a function to calculate opportunity success rate
CREATE OR REPLACE FUNCTION get_success_rate()
RETURNS TABLE(
  total_resolved INT,
  successful_trades INT,
  success_rate DECIMAL,
  avg_return DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INT as total_resolved,
    COUNT(CASE WHEN actual_return > 0 THEN 1 END)::INT as successful_trades,
    ROUND(
      COUNT(CASE WHEN actual_return > 0 THEN 1 END)::DECIMAL / 
      NULLIF(COUNT(*), 0) * 100, 2
    ) as success_rate,
    ROUND(AVG(actual_return), 4) as avg_return
  FROM opportunities 
  WHERE resolved = true 
  AND actual_return IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE stocks IS 'Current stock data and prices';
COMMENT ON TABLE opportunities IS 'Trading opportunities identified by the scanner';
COMMENT ON TABLE alerts IS 'System notifications and alerts';
COMMENT ON TABLE portfolio IS 'User portfolio positions';
COMMENT ON TABLE price_history IS 'Historical price data for trend analysis';
COMMENT ON TABLE sector_etfs IS 'Sector ETF performance data';
COMMENT ON TABLE crypto_data IS 'Cryptocurrency price data for correlation analysis';