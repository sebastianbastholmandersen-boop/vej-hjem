import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ToolSession {
  id?: string;
  toolName: string;
  sessionData: any;
  consented: boolean;
}

export const useDataCollection = () => {
  const { user } = useAuth();
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already given consent (stored in localStorage)
    const consent = localStorage.getItem('data_collection_consent');
    setHasConsented(consent === 'true');
  }, []);

  const saveConsent = (consented: boolean) => {
    setHasConsented(consented);
    localStorage.setItem('data_collection_consent', consented.toString());
    
    // Update any existing sessions with consent status
    if (consented) {
      const sessionId = localStorage.getItem('current_session_id');
      if (sessionId) {
        updateSessionConsent(sessionId, true);
      }
    }
  };

  const saveToolData = async (toolName: string, data: any): Promise<string | null> => {
    try {
      // Always save the data, but mark consent based on user preference
      const sessionData = {
        user_id: user?.id || null,
        tool_name: toolName,
        session_data: data,
        consented: hasConsented || false,
        ip_address: null, // Could be populated server-side
        user_agent: navigator.userAgent
      };

      const { data: session, error } = await supabase
        .from('tool_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error('Error saving tool data:', error);
        return null;
      }

      // Store session ID for later consent updates
      if (session?.id) {
        localStorage.setItem('current_session_id', session.id);
      }

      return session?.id || null;
    } catch (error) {
      console.error('Error saving tool data:', error);
      return null;
    }
  };

  const updateSessionConsent = async (sessionId: string, consented: boolean) => {
    try {
      const { error } = await supabase
        .from('tool_sessions')
        .update({ consented })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating consent:', error);
      }
    } catch (error) {
      console.error('Error updating consent:', error);
    }
  };

  const updateToolData = async (sessionId: string, data: any) => {
    try {
      const { error } = await supabase
        .from('tool_sessions')
        .update({ 
          session_data: data,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating tool data:', error);
      }
    } catch (error) {
      console.error('Error updating tool data:', error);
    }
  };

  return {
    hasConsented,
    saveConsent,
    saveToolData,
    updateToolData,
    updateSessionConsent
  };
};