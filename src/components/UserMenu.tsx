import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  user_type: 'individual' | 'company';
  first_name?: string;
  last_name?: string;
  company_name?: string;
  cvr_number?: string;
}

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type, first_name, last_name, company_name, cvr_number')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Du er nu logget ud",
        description: "På gensyn!",
      });
    } catch (error) {
      toast({
        title: "Fejl ved logout",
        description: "Der opstod en fejl. Prøv igen.",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  const getDisplayName = () => {
    if (!profile) return user.email?.slice(0, 2).toUpperCase() || '?';
    
    if (profile.user_type === 'company') {
      return profile.company_name?.slice(0, 2).toUpperCase() || 'V';
    } else {
      const firstName = profile.first_name || '';
      const lastName = profile.last_name || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
    }
  };

  const getDisplayText = () => {
    if (!profile) return user.email;
    
    if (profile.user_type === 'company') {
      return profile.company_name || user.email;
    } else {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email;
    }
  };

  const userInitials = getDisplayName();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{getDisplayText()}</p>
            <p className="text-xs text-muted-foreground">
              {profile?.user_type === 'company' ? (
                <>
                  <Building2 className="inline w-3 h-3 mr-1" />
                  Virksomhed
                  {profile.cvr_number && ` (CVR: ${profile.cvr_number})`}
                </>
              ) : (
                <>
                  <User className="inline w-3 h-3 mr-1" />
                  Privatperson
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log ud</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;