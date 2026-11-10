import type { User, ThreatReport } from '../types/threat';
import { createClient } from '@supabase/supabase-js';

/**
 * ============================================================================
 * SCAMSHIELD AI - DATABASE & AUTH SERVICE
 * ============================================================================
 * Architecture: Supabase Live Connection
 * ============================================================================
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please check your .env file.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Authenticate existing user with Email and Password
 */
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("No user returned from Supabase.");

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
      role: data.user.user_metadata?.role || 'SecOps Analyst',
      createdAt: data.user.created_at,
    };
  } catch (error) {
    const err = error as Error;
    console.error('[db:loginUser] Error authenticating user:', err.message);
    throw err;
  }
}

/**
 * Register a new user account with Email and Password
 */
export async function registerUser(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("Registration failed.");

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.email!.split('@')[0],
      role: 'SecOps Analyst',
      createdAt: data.user.created_at,
    };
  } catch (error) {
    const err = error as Error;
    console.error('[db:registerUser] Error creating user:', err.message);
    throw err;
  }
}

/**
 * Persist a scan verdict to the user's scan history table
 */
export async function saveScanResult(userId: string, scanData: ThreatReport): Promise<ThreatReport> {
  try {
    const { data, error } = await supabase.from('scans').insert([{
      user_id: userId,
      target: scanData.target,
      risk_score: scanData.riskScore,
      severity: scanData.severity,
      payload: scanData, // Saving the full structured object for easy frontend rendering
      created_at: new Date().toISOString()
    }]).select().single();
    
    if (error) throw new Error(error.message);
    
    console.info(`[db:saveScanResult] Successfully saved scan for user ${userId}`);
    return data.payload;
  } catch (error) {
    const err = error as Error;
    console.error('[db:saveScanResult] Error saving scan report:', err.message);
    throw err;
  }
}

/**
 * Retrieve scan history records for a given user
 */
export async function getUserScanHistory(userId: string): Promise<ThreatReport[]> {
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(error.message);
    
    // Extracting the payload object from each database row
    return data.map(row => row.payload as ThreatReport);
  } catch (error) {
    const err = error as Error;
    console.error('[db:getUserScanHistory] Error fetching scan history:', err.message);
    return [];
  }
}