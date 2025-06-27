import type { APIRoute } from 'astro';
import { OpportunityScanner } from '../../lib/scanners';
import { SupabaseManager } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🚀 Starting market scan...');
    
    // Run comprehensive scan
    const opportunities = await OpportunityScanner.runAllScans();
    
    // Create alert for scan completion
    if (opportunities.length > 0) {
      const topOpportunities = opportunities.slice(0, 3);
      const alertMessage = `Found ${opportunities.length} opportunities. Top picks: ${topOpportunities.map(o => o.symbol).join(', ')}`;
      
      await SupabaseManager.saveAlert({
        id: `scan_${Date.now()}`,
        type: 'opportunity',
        title: 'Market Scan Complete',
        message: alertMessage,
        severity: 'info',
        created: new Date(),
        read: false
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      opportunities: opportunities.length,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('❌ Scan failed:', error);
    
    // Create error alert
    await SupabaseManager.saveAlert({
      id: `error_${Date.now()}`,
      type: 'risk',
      title: 'Scan Failed',
      message: `Market scan encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'warning',
      created: new Date(),
      read: false
    });
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};