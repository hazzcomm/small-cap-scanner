import { S as SupabaseManager } from '../../chunks/supabase_DyqbeQF5.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const type = searchParams.get("type");
    const riskLevel = searchParams.get("risk");
    const limit = parseInt(searchParams.get("limit") || "50");
    let opportunities;
    if (type) {
      opportunities = await SupabaseManager.getOpportunitiesByType(type);
    } else if (riskLevel) {
      opportunities = await SupabaseManager.getOpportunitiesByRisk(riskLevel);
    } else {
      opportunities = await SupabaseManager.getActiveOpportunities();
    }
    opportunities = opportunities.slice(0, limit);
    return new Response(JSON.stringify({
      success: true,
      opportunities,
      total: opportunities.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const PUT = async ({ request }) => {
  try {
    const data = await request.json();
    const { id, resolved, actualReturn } = data;
    if (!id) {
      return new Response(JSON.stringify({
        success: false,
        error: "Opportunity ID required"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    await SupabaseManager.updateOpportunity(id, { resolved, actualReturn });
    return new Response(JSON.stringify({
      success: true,
      message: "Opportunity updated"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
