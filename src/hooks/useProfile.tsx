import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserType = 'individual' | 'company';

export interface Profile {
  id: string;
  user_id: string;
  user_type: UserType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  cvr_number?: string;
  company_address?: string;
  contact_person?: string;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No user or profile found' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error: error.message };
      }

      setProfile(data);
      return { data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const getDisplayName = () => {
    if (!profile) return '';
    
    if (profile.user_type === 'individual') {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    } else {
      return profile.company_name || '';
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    fetchProfile,
    getDisplayName,
  };
};