# Small Cap Opportunity Scanner

An AI-aware ASX small cap stock scanner designed for swing traders. Identifies undervalued opportunities that human traders can capitalize on before algorithmic trading systems.

## 🎯 Target User
- 66-year-old experienced trader
- $10-30k position sizes
- 2-day to 2-week holding periods
- Focus on small caps ($50M-$500M market cap)

## 🔍 Core Features

### 1. Sector Laggard Detection
- Tracks sector ETFs vs individual small caps
- Identifies stocks trading below sector momentum
- Example: Gold sector up 5%, small gold stock flat

### 2. Crypto Correlation Tracker
- Monitors ASX:DCC, ASX:CRYP, ASX:EBTC vs BTC/ETH
- Alerts on 2+ day correlation lags
- Historical pattern analysis

### 3. Technical Oversold Scanner
- RSI-based oversold detection
- Volume analysis for unusual activity
- Fundamental soundness checks

### 4. AI-Aware Scoring System
- **Human Advantage Factors** (increase score):
  - Multi-day lag opportunities
  - Small cap blind spots
  - Cross-asset correlations
  - Sentiment/fundamental gaps

- **AI Disadvantage Factors** (decrease score):
  - High frequency patterns
  - Extreme volume spikes
  - Large cap efficiency
  - Obvious technical signals

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
# Start development server
npm run dev

# Seed database with test data
node src/scripts/data-seeder.js

# Run market scan
npm run scanner
```

### Production Build
```bash
npm run build
npm run preview
```

## 📊 Data Sources

### Primary (Free/Low-cost)
- **Yahoo Finance**: Real-time ASX data, volume, basic fundamentals
- **CoinGecko**: Crypto prices for correlation analysis
- **Alpha Vantage**: Technical indicators (free tier: 5 calls/min)

### Backup Options
- **Finnhub**: News, earnings data
- **ASX Data**: Official feeds (paid tiers)

## 🗄️ Database Schema

### Tables
- `stocks`: Current stock data, prices, volume
- `opportunities`: Flagged trading opportunities with AI scores
- `portfolio`: Position tracking and P&L
- `alerts`: Notifications and system messages
- `price_history`: Historical data for trend analysis
- `sector_etfs`: ETF performance tracking
- `crypto_data`: BTC/ETH prices for correlation

## 🔄 Scanning Process

1. **Data Collection**: Fetch current ASX prices, crypto prices, sector ETFs
2. **Opportunity Detection**: Run sector laggard, oversold, and correlation scanners
3. **AI-Aware Scoring**: Apply human advantage multipliers and AI disadvantage penalties
4. **Ranking & Filtering**: Sort by AI-aware score, filter by quality thresholds
5. **Alert Generation**: Create notifications for high-score opportunities
6. **Database Storage**: Save opportunities and update historical data

## 🎯 AI-Aware Strategy

### Human Advantages
- **Multi-day timing**: AI focuses on intraday, humans can wait 2-5 days
- **Small cap access**: Algorithms avoid illiquid stocks under $200M
- **Cross-asset insight**: Crypto-to-mining correlations harder for single-asset AI
- **Sentiment gaps**: Emotional reactions AI misses

### Avoid AI Strengths
- **Technical patterns**: AI faster at recognizing classical TA
- **High volume events**: Algorithmic activity already present
- **Large caps**: Efficient markets with AI penetration
- **News reactions**: Instant AI processing advantage

## 📈 Success Metrics

- **Hit Rate**: % of flagged stocks moving favorably within 2 weeks
- **Average Return**: Per opportunity performance
- **False Positive Rate**: Opportunities that failed
- **Time to Move**: Lag from flag to significant price action

## 🔧 Configuration

### Environment Variables
```bash
# Optional API keys for enhanced data
ALPHA_VANTAGE_KEY=your_key_here
FINNHUB_KEY=your_key_here

# Database location
DATABASE_PATH=./database/scanner.db
```

### Scanning Parameters
- Market cap range: $50M - $500M
- Minimum AI score: 60/100
- Volume threshold: 150% of average
- Sector lag threshold: 3%
- Crypto correlation lag: 5%

## 📱 Mobile Usage

The scanner is fully responsive and optimized for mobile checking:
- Quick opportunity overview
- One-tap drill-down analysis
- Swipe-friendly alerts
- Export to watchlist apps

## ⚠️ Risk Management

- Position size suggestions based on volatility
- Sector concentration warnings
- Market condition alerts
- Stop-loss recommendations

## 🔄 Scheduled Operations

- **Every 15 minutes**: Price updates during market hours
- **Every hour**: Full opportunity scan
- **Daily 9am**: Pre-market summary email
- **Daily 4:30pm**: Post-market wrap-up

## 📊 Performance Tracking

The system tracks:
- Which opportunity types perform best
- Optimal holding periods
- Sector rotation effectiveness
- Crypto correlation reliability
- AI score accuracy over time

## 🚀 Future Enhancements

- Machine learning for pattern recognition
- Options flow integration
- Insider trading data
- Broker sentiment analysis
- Portfolio optimization suggestions

---

**Remember**: This is a tool for identifying opportunities, not investment advice. Always conduct your own research and manage risk appropriately.