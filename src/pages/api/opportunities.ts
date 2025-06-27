import type { APIRoute } from 'astro';
import { SupabaseManager } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const type = searchParams.get('type');
    const riskLevel = searchParams.get('risk');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    let opportunities;
    
    // Apply filters
    if (type) {
      opportunities = await SupabaseManager.getOpportunitiesByType(type);
    } else if (riskLevel) {
      opportunities = await SupabaseManager.getOpportunitiesByRisk(riskLevel);
    } else {
      opportunities = await SupabaseManager.getActiveOpportunities();
    }
    
    // Limit results
    opportunities = opportunities.slice(0, limit);
    
    return new Response(JSON.stringify({
      success: true,
      opportunities,
      total: opportunities.length
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
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

export const PUT: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, resolved, actualReturn } = data;
    
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Opportunity ID required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Update opportunity in database
    await SupabaseManager.updateOpportunity(id, { resolved, actualReturn });
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Opportunity updated'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
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