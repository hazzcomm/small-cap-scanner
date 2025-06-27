import { createClient } from '@supabase/supabase-js';
import type { Stock, Opportunity, Alert } from '../types/index';

// Initialize Supabase client
const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE4NTc2NDcsImV4cCI6MTk4NzQzMzY0N30.placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database operations
export class SupabaseManager {
  
  // Stock operations
  static async upsertStock(stock: Stock) {
    const { error } = await supabase
      .from('stocks')
      .upsert({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change_amount: stock.change,
        change_percent: stock.changePercent,
        volume: stock.volume,
        market_cap: stock.marketCap,
        sector: stock.sector,
        last_updated: stock.lastUpdated.toISOString()
      });
    
    if (error) throw error;
  }

  static async getStock(symbol: string): Promise<Stock | null> {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('symbol', symbol)
      .single();
    
    if (error || !data) return null;
    
    return {
      symbol: data.symbol,
      name: data.name,
      price: data.price,
      change: data.change_amount,
      changePercent: data.change_percent,
      volume: data.volume,
      marketCap: data.market_cap,
      sector: data.sector,
      lastUpdated: new Date(data.last_updated)
    };
  }

  static async getAllStocks(): Promise<Stock[]> {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('market_cap', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(row => ({
      symbol: row.symbol,
      name: row.name,
      price: row.price,
      change: row.change_amount,
      changePercent: row.change_percent,
      volume: row.volume,
      marketCap: row.market_cap,
      sector: row.sector,
      lastUpdated: new Date(row.last_updated)
    }));
  }

  // Opportunity operations
  static async saveOpportunity(opportunity: Opportunity) {
    const { error } = await supabase
      .from('opportunities')
      .upsert({
        id: opportunity.id,
        symbol: opportunity.symbol,
        type: opportunity.type,
        score: opportunity.score,
        ai_aware_score: opportunity.aiAwareScore,
        description: opportunity.description,
        triggers: opportunity.triggers,
        risk_level: opportunity.riskLevel,
        target_price: opportunity.targetPrice,
        stop_loss: opportunity.stopLoss,
        timeframe: opportunity.timeframe,
        flagged_date: opportunity.flaggedDate.toISOString(),
        resolved: opportunity.resolved || false,
        actual_return: opportunity.actualReturn
      });
    
    if (error) throw error;
  }

  static async getActiveOpportunities(): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('resolved', false)
      .order('ai_aware_score', { ascending: false })
      .order('flagged_date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      symbol: row.symbol,
      type: row.type,
      score: row.score,
      aiAwareScore: row.ai_aware_score,
      description: row.description,
      triggers: row.triggers,
      riskLevel: row.risk_level,
      targetPrice: row.target_price,
      stopLoss: row.stop_loss,
      timeframe: row.timeframe,
      flaggedDate: new Date(row.flagged_date),
      resolved: row.resolved,
      actualReturn: row.actual_return
    }));
  }

  static async updateOpportunity(id: string, updates: Partial<Opportunity>) {
    const updateData: any = {};
    
    if (updates.resolved !== undefined) updateData.resolved = updates.resolved;
    if (updates.actualReturn !== undefined) updateData.actual_return = updates.actualReturn;
    
    const { error } = await supabase
      .from('opportunities')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  }

  // Alert operations
  static async saveAlert(alert: Alert) {
    const { error } = await supabase
      .from('alerts')
      .insert({
        id: alert.id,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        created: alert.created.toISOString(),
        read: alert.read
      });
    
    if (error) throw error;
  }

  static async getUnreadAlerts(): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('read', false)
      .order('created', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      severity: row.severity,
      created: new Date(row.created),
      read: row.read
    }));
  }

  static async markAlertAsRead(id: string) {
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('id', id);
    
    if (error) throw error;
  }

  // Utility functions
  static async getOpportunitiesByType(type: string): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('type', type)
      .eq('resolved', false)
      .order('ai_aware_score', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      symbol: row.symbol,
      type: row.type,
      score: row.score,
      aiAwareScore: row.ai_aware_score,
      description: row.description,
      triggers: row.triggers,
      riskLevel: row.risk_level,
      targetPrice: row.target_price,
      stopLoss: row.stop_loss,
      timeframe: row.timeframe,
      flaggedDate: new Date(row.flagged_date),
      resolved: row.resolved,
      actualReturn: row.actual_return
    }));
  }

  static async getOpportunitiesByRisk(riskLevel: string): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('risk_level', riskLevel)
      .eq('resolved', false)
      .order('ai_aware_score', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      symbol: row.symbol,
      type: row.type,
      score: row.score,
      aiAwareScore: row.ai_aware_score,
      description: row.description,
      triggers: row.triggers,
      riskLevel: row.risk_level,
      targetPrice: row.target_price,
      stopLoss: row.stop_loss,
      timeframe: row.timeframe,
      flaggedDate: new Date(row.flagged_date),
      resolved: row.resolved,
      actualReturn: row.actual_return
    }));
  }

  // Performance tracking
  static async getPerformanceStats() {
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('resolved', true)
      .not('actual_return', 'is', null);
    
    if (error) throw error;
    
    const stats = {
      totalOpportunities: opportunities?.length || 0,
      successfulTrades: opportunities?.filter(o => (o.actual_return || 0) > 0).length || 0,
      averageReturn: 0,
      bestPerformer: null as any,
      worstPerformer: null as any
    };
    
    if (opportunities && opportunities.length > 0) {
      const returns = opportunities.map(o => o.actual_return || 0);
      stats.averageReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      stats.bestPerformer = opportunities.find(o => o.actual_return === Math.max(...returns));
      stats.worstPerformer = opportunities.find(o => o.actual_return === Math.min(...returns));
    }
    
    return stats;
  }
}