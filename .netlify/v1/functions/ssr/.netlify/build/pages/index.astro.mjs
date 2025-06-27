/* empty css                                 */
import { c as createComponent, a as createAstro, b as addAttribute, d as renderHead, e as renderSlot, r as renderTemplate, f as renderComponent, m as maybeRenderHead } from '../chunks/astro/server_Dpv2H2TU.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title, description = "Small Cap Opportunity Scanner - Find undervalued ASX stocks with AI-aware analysis" } = Astro2.props;
  return renderTemplate`<html lang="en" class="h-full"> <head><meta charset="UTF-8"><meta name="description"${addAttribute(description, "content")}><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body class="h-full bg-gray-50"> <div class="min-h-full"> <!-- Navigation --> <nav class="bg-white shadow-sm border-b border-gray-200"> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div class="flex justify-between h-16"> <div class="flex"> <div class="flex-shrink-0 flex items-center"> <h1 class="text-xl font-bold text-gray-900">Small Cap Scanner</h1> </div> <div class="hidden sm:ml-6 sm:flex sm:space-x-8"> <a href="/" class="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
Dashboard
</a> <a href="/opportunities" class="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
Opportunities
</a> <a href="/portfolio" class="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
Portfolio
</a> <a href="/alerts" class="border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">
Alerts
</a> </div> </div> <div class="flex items-center"> <button id="scan-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
Run Scan
</button> </div> </div> </div> </nav> <!-- Main content --> <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> ${renderSlot($$result, $$slots["default"])} </main> </div> <!-- Loading overlay --> <div id="loading-overlay" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"> <div class="bg-white p-6 rounded-lg shadow-lg"> <div class="flex items-center"> <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div> <span class="text-lg font-medium">Scanning markets...</span> </div> </div> </div>  </body> </html>`;
}, "/home/paul/projects/small-cap-scanner-standalone/src/layouts/Layout.astro", void 0);

const staticOpportunities = [
  {
    id: "crypto_dcc_001",
    symbol: "DCC.AX",
    type: "crypto_correlation",
    score: 75,
    aiAwareScore: 89,
    description: "DigitalX lagging Bitcoin by 8.5% over 2 days",
    triggers: [
      "Bitcoin up 12.3% in 2 days",
      "DCC.AX up only 3.8%",
      "Historical correlation: ~70%"
    ],
    riskLevel: "medium",
    timeframe: "1-5 days",
    flaggedDate: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "oversold_nva_001",
    symbol: "NVA.AX",
    type: "oversold",
    score: 68,
    aiAwareScore: 82,
    description: "Nova Minerals oversold with 12.5% decline on high volume",
    triggers: [
      "Price down 12.5%",
      "Volume: 5.2M (3x average)",
      "No negative news identified"
    ],
    riskLevel: "high",
    timeframe: "3-14 days",
    flaggedDate: new Date(Date.now() - 45 * 60 * 1e3).toISOString()
  },
  {
    id: "sector_mem_001",
    symbol: "MEM.AX",
    type: "sector_laggard",
    score: 72,
    aiAwareScore: 85,
    description: "Memphasys lagging Healthcare sector by 6.2%",
    triggers: [
      "Healthcare sector (XHJ) up 5.1%",
      "MEM.AX down 11.1%",
      "Relative lag: 16.2%"
    ],
    riskLevel: "medium",
    timeframe: "2-10 days",
    flaggedDate: new Date(Date.now() - 3 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "crypto_ebtc_001",
    symbol: "EBTC.AX",
    type: "crypto_correlation",
    score: 65,
    aiAwareScore: 78,
    description: "Bitcoin ETF lagging Bitcoin by 6% over 24 hours",
    triggers: [
      "Bitcoin up 8.2% in 24h",
      "EBTC.AX up only 2.1%",
      "ETF premium compressed"
    ],
    riskLevel: "low",
    timeframe: "1-3 days",
    flaggedDate: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "oversold_ffg_001",
    symbol: "FFG.AX",
    type: "oversold",
    score: 58,
    aiAwareScore: 71,
    description: "Fatfish Group oversold in tech selloff",
    triggers: [
      "Price down 8.5%",
      "Tech sector down 3.2%",
      "Volume 2x average"
    ],
    riskLevel: "high",
    timeframe: "5-15 days",
    flaggedDate: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString()
  }
];
const staticAlerts = [
  {
    id: "alert_001",
    type: "opportunity",
    title: "New High-Score Opportunity",
    message: "DCC.AX crypto correlation opportunity scored 89/100",
    severity: "info",
    created: new Date(Date.now() - 30 * 60 * 1e3).toISOString(),
    read: false
  },
  {
    id: "alert_002",
    type: "risk",
    title: "High Volume Alert",
    message: "NVA.AX trading 3x normal volume with -12.5% price drop",
    severity: "warning",
    created: new Date(Date.now() - 45 * 60 * 1e3).toISOString(),
    read: false
  },
  {
    id: "alert_003",
    type: "update",
    title: "Market Scan Complete",
    message: "Found 5 opportunities. Top picks: DCC.AX, MEM.AX, EBTC.AX",
    severity: "info",
    created: new Date(Date.now() - 60 * 60 * 1e3).toISOString(),
    read: true
  }
];
const staticMarketData = {
  asxAll: { change: 0.8, volume: "2.1B" },
  smallCaps: { change: -0.2, volume: "180M" },
  crypto: { btc: 2.3, eth: 1.8 },
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
};
function getActiveOpportunities(limit = 50) {
  return staticOpportunities.sort((a, b) => b.aiAwareScore - a.aiAwareScore).slice(0, limit);
}
function getUnreadAlerts(limit = 10) {
  return staticAlerts.filter((alert) => !alert.read).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()).slice(0, limit);
}

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const opportunities = getActiveOpportunities(6);
  const alerts = getUnreadAlerts(5);
  const marketSummary = staticMarketData;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Small Cap Scanner - Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="px-4 py-6 sm:px-0"> <!-- Market Summary --> <div class="mb-8"> <h2 class="text-2xl font-bold text-gray-900 mb-4">Market Overview</h2> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> <div class="bg-white overflow-hidden shadow rounded-lg"> <div class="p-5"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"> <span class="text-white text-sm font-medium">ASX</span> </div> </div> <div class="ml-5 w-0 flex-1"> <dl> <dt class="text-sm font-medium text-gray-500 truncate">ASX All Ords</dt> <dd class="flex items-baseline"> <div class="text-2xl font-semibold text-gray-900"> ${"+" }${marketSummary.asxAll.change}%
</div> <div class="ml-2 flex items-baseline text-sm text-gray-600">
Vol: ${marketSummary.asxAll.volume} </div> </dd> </dl> </div> </div> </div> </div> <div class="bg-white overflow-hidden shadow rounded-lg"> <div class="p-5"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"> <span class="text-white text-sm font-medium">SC</span> </div> </div> <div class="ml-5 w-0 flex-1"> <dl> <dt class="text-sm font-medium text-gray-500 truncate">Small Caps</dt> <dd class="flex items-baseline"> <div class="text-2xl font-semibold text-gray-900"> ${""}${marketSummary.smallCaps.change}%
</div> <div class="ml-2 flex items-baseline text-sm text-gray-600">
Vol: ${marketSummary.smallCaps.volume} </div> </dd> </dl> </div> </div> </div> </div> <div class="bg-white overflow-hidden shadow rounded-lg"> <div class="p-5"> <div class="flex items-center"> <div class="flex-shrink-0"> <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"> <span class="text-white text-sm font-medium">₿</span> </div> </div> <div class="ml-5 w-0 flex-1"> <dl> <dt class="text-sm font-medium text-gray-500 truncate">Crypto</dt> <dd class="flex items-baseline"> <div class="text-lg font-semibold text-gray-900">
BTC: +${marketSummary.crypto.btc}%
</div> <div class="ml-2 text-sm text-gray-600">
ETH: +${marketSummary.crypto.eth}%
</div> </dd> </dl> </div> </div> </div> </div> </div> </div> <!-- Top Opportunities --> <div class="mb-8"> <div class="flex justify-between items-center mb-4"> <h2 class="text-2xl font-bold text-gray-900">Top Opportunities</h2> <a href="/opportunities" class="text-blue-600 hover:text-blue-500 text-sm font-medium">
View all →
</a> </div> ${opportunities.length === 0 ? renderTemplate`<div class="bg-white shadow rounded-lg p-6 text-center"> <div class="text-gray-500 mb-4"> <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path> </svg> </div> <h3 class="text-lg font-medium text-gray-900 mb-2">No opportunities found</h3> <p class="text-gray-500 mb-4">Run a scan to identify potential trading opportunities</p> <button id="scan-dashboard" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
Run Initial Scan
</button> </div>` : renderTemplate`<div class="bg-white shadow overflow-hidden sm:rounded-md"> <ul class="divide-y divide-gray-200"> ${opportunities.map((opp) => renderTemplate`<li> <div class="px-4 py-4 sm:px-6 hover:bg-gray-50"> <div class="flex items-center justify-between"> <div class="flex items-center"> <div class="flex-shrink-0"> <span${addAttribute(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${opp.type === "sector_laggard" ? "bg-blue-100 text-blue-800" : opp.type === "crypto_correlation" ? "bg-yellow-100 text-yellow-800" : opp.type === "oversold" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`, "class")}> ${opp.type.replace("_", " ")} </span> </div> <div class="ml-4"> <div class="flex items-center"> <div class="text-sm font-medium text-gray-900"> ${opp.symbol} </div> <div${addAttribute(`ml-2 text-sm ${opp.riskLevel === "low" ? "text-green-600" : opp.riskLevel === "medium" ? "text-yellow-600" : "text-red-600"}`, "class")}> ${opp.riskLevel} risk
</div> </div> <div class="text-sm text-gray-500"> ${opp.description} </div> </div> </div> <div class="flex items-center"> <div class="text-right mr-4"> <div class="text-sm font-medium text-gray-900">
AI Score: ${Math.round(opp.aiAwareScore)} </div> <div class="text-sm text-gray-500"> ${opp.timeframe} </div> </div> <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path> </svg> </div> </div> <div class="mt-2"> <div class="text-sm text-gray-500"> <strong>Triggers:</strong> ${opp.triggers.join(" \u2022 ")} </div> </div> </div> </li>`)} </ul> </div>`} </div> <!-- Recent Alerts --> <div class="mb-8"> <div class="flex justify-between items-center mb-4"> <h2 class="text-2xl font-bold text-gray-900">Recent Alerts</h2> <a href="/alerts" class="text-blue-600 hover:text-blue-500 text-sm font-medium">
View all →
</a> </div> ${alerts.length === 0 ? renderTemplate`<div class="bg-white shadow rounded-lg p-6 text-center text-gray-500">
No recent alerts
</div>` : renderTemplate`<div class="bg-white shadow overflow-hidden sm:rounded-md"> <ul class="divide-y divide-gray-200"> ${alerts.map((alert) => renderTemplate`<li> <div class="px-4 py-4 sm:px-6"> <div class="flex items-center"> <div${addAttribute(`flex-shrink-0 w-2 h-2 rounded-full ${alert.severity === "critical" ? "bg-red-400" : alert.severity === "warning" ? "bg-yellow-400" : "bg-blue-400"}`, "class")}></div> <div class="ml-3"> <div class="text-sm font-medium text-gray-900"> ${alert.title} </div> <div class="text-sm text-gray-500"> ${alert.message} </div> </div> <div class="ml-auto text-sm text-gray-400"> ${new Date(alert.created).toLocaleTimeString()} </div> </div> </div> </li>`)} </ul> </div>`} </div> <!-- AI Trading Insights --> <div class="bg-blue-50 border border-blue-200 rounded-lg p-6"> <div class="flex"> <div class="flex-shrink-0"> <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"> <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path> </svg> </div> <div class="ml-3"> <h3 class="text-sm font-medium text-blue-800">
AI-Aware Trading Intelligence
</h3> <div class="mt-2 text-sm text-blue-700"> <p>This scanner uses AI-aware scoring to identify opportunities that human traders can capitalize on before algorithmic trading systems. Focus on multi-day opportunities in small caps where AI has limited penetration.</p> </div> </div> </div> </div> </div>  ` })}`;
}, "/home/paul/projects/small-cap-scanner-standalone/src/pages/index.astro", void 0);

const $$file = "/home/paul/projects/small-cap-scanner-standalone/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
