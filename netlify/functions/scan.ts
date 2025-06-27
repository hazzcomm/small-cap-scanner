import type { Handler } from '@netlify/functions';
import { SupabaseManager } from '../../src/lib/supabase.js';

// Simple mock scanner for Netlify Functions
export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('🚀 Starting market scan...');
    
    // Mock scan results for now
    const mockOpportunities = [
      {
        id: `scan_${Date.now()}_1`,
        symbol: 'DCC.AX',
        type: 'crypto_correlation' as const,
        score: 75,
        aiAwareScore: 89,
        description: 'DigitalX lagging Bitcoin by 8.5% over 2 days',
        triggers: [
          'Bitcoin up 12.3% in 2 days',
          'DCC.AX up only 3.8%',
          'Historical correlation: ~70%'
        ],
        riskLevel: 'medium' as const,
        timeframe: '1-5 days',
        flaggedDate: new Date()
      },
      {
        id: `scan_${Date.now()}_2`,
        symbol: 'NVA.AX',
        type: 'oversold' as const,
        score: 68,
        aiAwareScore: 82,
        description: 'Nova Minerals oversold with 12.5% decline',
        triggers: [
          'Price down 12.5%',
          'Volume: 5.2M (3x average)',
          'No negative news identified'
        ],
        riskLevel: 'high' as const,
        timeframe: '3-14 days',
        flaggedDate: new Date()
      }
    ];

    // Save opportunities to Supabase
    for (const opportunity of mockOpportunities) {
      await SupabaseManager.saveOpportunity(opportunity);
    }

    // Create completion alert
    await SupabaseManager.saveAlert({
      id: `scan_complete_${Date.now()}`,
      type: 'opportunity',
      title: 'Market Scan Complete',
      message: `Found ${mockOpportunities.length} new opportunities`,
      severity: 'info',
      created: new Date(),
      read: false
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        opportunities: mockOpportunities.length,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('❌ Scan failed:', error);

    // Save error alert
    try {
      await SupabaseManager.saveAlert({
        id: `error_${Date.now()}`,
        type: 'risk',
        title: 'Scan Failed',
        message: `Market scan error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'warning',
        created: new Date(),
        read: false
      });
    } catch (alertError) {
      console.error('Failed to save error alert:', alertError);
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};