import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ToolSessionData {
  tool_name: string;
  session_data: any;
  consented: boolean;
}

export const useToolSession = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const saveToolSession = useCallback(async (
    toolName: string, 
    sessionData: any, 
    consented: boolean = false
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tool_sessions')
        .insert({
          user_id: user?.id || null,
          tool_name: toolName,
          session_data: sessionData,
          consented: consented,
          ip_address: null, // Could be filled by edge function if needed
          user_agent: navigator.userAgent
        })
        .select('id')
        .single();

      if (error) throw error;
      
      setSessionId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error saving tool session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateConsent = useCallback(async (sessionId: string, consented: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tool_sessions')
        .update({ consented, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating consent:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSessionData = useCallback(async (sessionId: string, sessionData: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tool_sessions')
        .update({ session_data: sessionData, updated_at: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating session data:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessionId,
    loading,
    saveToolSession,
    updateConsent,
    updateSessionData
  };
};