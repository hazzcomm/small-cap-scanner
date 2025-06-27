import type { Handler } from '@netlify/functions';
import { SupabaseManager } from '../../src/lib/supabase.js';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      const url = new URL(event.rawUrl || `https://example.com${event.path}`);
      const type = url.searchParams.get('type');
      const riskLevel = url.searchParams.get('risk');
      const limit = parseInt(url.searchParams.get('limit') || '50');

      let opportunities;

      if (type) {
        opportunities = await SupabaseManager.getOpportunitiesByType(type);
      } else if (riskLevel) {
        opportunities = await SupabaseManager.getOpportunitiesByRisk(riskLevel);
      } else {
        opportunities = await SupabaseManager.getActiveOpportunities();
      }

      // Apply limit
      opportunities = opportunities.slice(0, limit);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          opportunities,
          total: opportunities.length
        })
      };
    }

    if (event.httpMethod === 'PUT') {
      const data = JSON.parse(event.body || '{}');
      const { id, resolved, actualReturn } = data;

      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            error: 'Opportunity ID required'
          })
        };
      }

      await SupabaseManager.updateOpportunity(id, { resolved, actualReturn });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Opportunity updated'
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
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