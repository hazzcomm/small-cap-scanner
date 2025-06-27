# 🎯 Small Cap Scanner - User Manual

## **Understanding the Opportunity Types:**

### **🔴 Sector Laggard** (Highest Priority)
- **What it means:** Small cap is underperforming its sector ETF (XEJ, XMJ, XTJ)
- **Example:** Mining stock down 8% while XMJ is only down 2%
- **Edge:** Sector rotation often brings laggards back in line
- **Timeframe:** 3-10 days typically

### **📉 Oversold** 
- **What it means:** RSI below 30 + high volume + fundamental strength
- **Edge:** Algorithms often oversell on technical signals, humans can spot value
- **Best when:** Combined with sector strength

### **₿ Crypto Correlation**
- **What it means:** DCC, CRYP, EBTC haven't moved with Bitcoin/Ethereum yet
- **Example:** Bitcoin up 15%, but DCC still flat
- **Edge:** Correlation lag gives 1-3 day window before algos catch up

## **AI-Aware Score Breakdown:**

### **Score: 85-100** 🟢 **Prime Opportunities**
- Strong human edge over algorithms
- Multiple confirmation signals
- Low institutional coverage
- **Action:** Strong consideration for $20-30k position

### **Score: 70-84** 🟡 **Good Opportunities** 
- Solid setup with human advantage
- 1-2 strong signals
- **Action:** Smaller $10-15k position, monitor closely

### **Score: 50-69** 🟠 **Watch List**
- Developing opportunity
- May need more confirmation
- **Action:** Paper trade or micro position

### **Score: <50** 🔴 **Avoid**
- Likely already discovered by algorithms
- High risk/low reward

## **Risk Level Guide:**

### **🟢 Low Risk**
- Established companies
- Strong balance sheets
- Clear catalyst

### **🟡 Medium Risk** 
- Growth companies
- Some uncertainty
- Moderate volatility

### **🔴 High Risk**
- Speculative plays
- High volatility
- Requires tight stops

## **Daily Scanning Strategy:**

### **Morning Routine (Pre-Market):**
1. **Run scan** at 8:30 AM
2. **Sort by AI-Aware Score** (highest first)
3. **Focus on new opportunities** (flagged in last 24 hours)
4. **Check sector context** - Is XEJ/XMJ/XTJ trending?

### **What to Look For:**
- **New sector laggards** after sector ETF moves
- **Crypto correlations** when Bitcoin/Ethereum gap up/down
- **High scores (80+)** with low risk ratings
- **Multiple triggers** listed in description

### **Position Sizing:**
- **Score 85+:** Up to $30k (your max)
- **Score 70-84:** $10-20k 
- **Score 50-69:** $5-10k (learning positions)

### **Exit Strategy:**
- **Target prices** shown in opportunity details
- **Stop losses** pre-calculated 
- **Timeframe** indicates expected hold period
- **Monitor daily** - human edge diminishes as algos catch up

## **Pro Tips:**

1. **Best opportunities:** Combine sector laggard + crypto correlation
2. **Timing:** Early morning scans catch overnight gaps
3. **Volume matters:** Look for unusual volume spikes
4. **Sector rotation:** Follow XEJ strength for mining opportunities
5. **Crypto correlation:** Check Bitcoin dominance trends

## **Technical Details:**

### **Data Sources:**
- **Stock prices:** Yahoo Finance API (free tier)
- **Crypto data:** CoinGecko API (free tier)
- **Sector ETFs:** Real-time ASX data
- **Volume/Technical:** Calculated from price history

### **AI-Aware Scoring Algorithm:**
The scanner uses a **deterministic algorithm** (not external AI APIs) that:

1. **Calculates base technical scores** (RSI, volume, momentum)
2. **Applies human advantage multipliers:**
   - +20 points for sector laggards (humans spot rotation patterns)
   - +15 points for crypto correlations (timing edge before algos)
   - +10 points for low institutional ownership
   - -15 points for high-frequency trading patterns
   - -10 points for algorithmic volume signatures

3. **Risk adjustment** based on volatility and liquidity
4. **Timeframe optimization** for 2-14 day holds

**No external AI API keys required** - the "AI-aware" scoring is built into the algorithm to specifically target opportunities where human traders have advantages over algorithmic systems.

## **Troubleshooting:**

### **"No opportunities found"**
- Market may be in strong trend (fewer mean reversion opportunities)
- Try different scan times (market open, after news)
- Check if data sources are accessible

### **"Scan failed"**
- Check internet connection
- Yahoo Finance may be rate limiting
- Wait 5 minutes and try again

### **Old data showing**
- Scanner caches data for 5 minutes
- Refresh the page to force new scan
- Check system time is correct

## **Best Practices:**

1. **Scan daily** at consistent times
2. **Start small** - $5-10k positions while learning
3. **Track results** - note which opportunity types work best
4. **Market conditions matter** - fewer opportunities in strong trends
5. **Don't chase** - if you miss an opportunity, wait for the next one

## **Risk Warning:**

This scanner is for educational and research purposes. All trading involves risk. Past performance doesn't guarantee future results. Always do your own research and consider seeking professional financial advice.

---

**Your scanner targets the 2-14 day timeframe where human analysis and pattern recognition can outperform algorithmic trading systems.** 🎯