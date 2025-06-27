# Deployment Strategy - Small Cap Scanner

## Netlify + Supabase Architecture (Recommended)

### Why This Approach?
- **Static Frontend**: Blazing fast on Netlify
- **Supabase Database**: Real-time PostgreSQL with APIs
- **Netlify Functions**: Serverless scanning logic
- **Cost**: $0-25/month depending on usage

### Architecture
```
Frontend (Astro) → Netlify Static
     ↓
Netlify Functions → Supabase Database
     ↓
External APIs (Yahoo Finance, CoinGecko)
```

### Setup Steps

#### 1. Supabase Setup
```sql
-- Create tables in Supabase
CREATE TABLE stocks (
  symbol TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  change_amount DECIMAL NOT NULL,
  change_percent DECIMAL NOT NULL,
  volume BIGINT NOT NULL,
  market_cap BIGINT NOT NULL,
  sector TEXT NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL,
  score DECIMAL NOT NULL,
  ai_aware_score DECIMAL NOT NULL,
  description TEXT NOT NULL,
  triggers JSONB NOT NULL,
  risk_level TEXT NOT NULL,
  target_price DECIMAL,
  stop_loss DECIMAL,
  timeframe TEXT NOT NULL,
  flagged_date TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  actual_return DECIMAL
);

CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  created TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);
```

#### 2. Environment Variables
```bash
# Netlify Environment Variables
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Optional API Keys
ALPHA_VANTAGE_KEY=your_key
FINNHUB_KEY=your_key
```

#### 3. Netlify Functions Structure
```
netlify/
  functions/
    scan.js          # Main scanning logic
    opportunities.js # Get/update opportunities
    stocks.js        # Stock data endpoints
    alerts.js        # Alert management
```

## Alternative: Static JSON Generation

### For Zero-Cost Solution
1. GitHub Actions runs scanner every hour
2. Generates static JSON files
3. Commits to repo
4. Netlify rebuilds automatically
5. Frontend loads from JSON files

### Pros/Cons
✅ **Pros**: $0 cost, simple, fast
❌ **Cons**: No real-time updates, limited functionality

## Simplified File-Based Version

Let me create a simplified version that works on Netlify immediately: