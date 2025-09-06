import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, Users, Database, MessageSquare, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  user_id: string;
  user_type: 'individual' | 'company';
  first_name?: string;
  last_name?: string;
  company_name?: string;
  cvr_number?: string;
  email?: string;
  created_at: string;
}

interface UserData {
  profiles: Profile[];
  budgets: any[];
  debts: any[];
  conversations: any[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState<UserData>({
    profiles: [],
    budgets: [],
    debts: [],
    conversations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminLoading && !isAdmin && user) {
      navigate('/');
      toast.error('Du har ikke adgang til admin området');
    }
  }, [isAdmin, adminLoading, user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles with auth user data
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          user_type,
          first_name,
          last_name,
          company_name,
          cvr_number,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get email addresses from auth.users
      const profilesWithEmail = await Promise.all(
        (profiles || []).map(async (profile) => {
          try {
            const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id);
            return {
              ...profile,
              email: authUser.user?.email || 'N/A'
            };
          } catch (error) {
            return {
              ...profile,
              email: 'N/A'
            };
          }
        })
      );

      // Fetch other data
      const [budgetsResult, debtsResult, conversationsResult] = await Promise.all([
        supabase.from('budgets').select('*').order('created_at', { ascending: false }),
        supabase.from('debts').select('*').order('created_at', { ascending: false }),
        supabase.from('chat_conversations').select('*').order('created_at', { ascending: false })
      ]);

      setUserData({
        profiles: profilesWithEmail,
        budgets: budgetsResult.data || [],
        debts: debtsResult.data || [],
        conversations: conversationsResult.data || []
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Fejl ved indlæsning af data');
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (profileId: string, userId: string) => {
    if (!confirm('Er du sikker på at du vil slette denne bruger? Dette kan ikke fortrydes.')) {
      return;
    }

    try {
      // Delete from auth.users (this will cascade delete profile due to foreign key)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast.success('Bruger slettet succesfuldt');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Fejl ved sletning af bruger');
    }
  };

  const deleteRecord = async (table: 'budgets' | 'debts' | 'chat_conversations', id: string) => {
    if (!confirm(`Er du sikker på at du vil slette denne ${table} record?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Record slettet succesfuldt');
      fetchAllData();
    } catch (error) {
      console.error(`Error deleting ${table}:`, error);
      toast.error(`Fejl ved sletning af ${table}`);
    }
  };

  const filteredProfiles = userData.profiles.filter(profile => 
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.cvr_number?.includes(searchTerm)
  );

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Indlæser admin panel...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Administrer brugere og data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Brugere</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.profiles.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budgetter</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.budgets.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gæld</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.debts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Samtaler</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.conversations.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Brugere</TabsTrigger>
            <TabsTrigger value="budgets">Budgetter</TabsTrigger>
            <TabsTrigger value="debts">Gæld</TabsTrigger>
            <TabsTrigger value="conversations">Samtaler</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Brugerhåndtering</CardTitle>
                <CardDescription>Se og administrer alle brugere i systemet</CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Søg brugere..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CVR</TableHead>
                      <TableHead>Oprettet</TableHead>
                      <TableHead>Handlinger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          {profile.user_type === 'individual' 
                            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
                            : profile.company_name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.user_type === 'company' ? 'default' : 'secondary'}>
                            {profile.user_type === 'company' ? 'Virksomhed' : 'Privat'}
                          </Badge>
                        </TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>{profile.cvr_number || 'N/A'}</TableCell>
                        <TableCell>{new Date(profile.created_at).toLocaleDateString('da-DK')}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteProfile(profile.id, profile.user_id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budgetter</CardTitle>
                <CardDescription>Se og administrer alle budgetter</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>År</TableHead>
                      <TableHead>Måned</TableHead>
                      <TableHead>Indtægter</TableHead>
                      <TableHead>Udgifter</TableHead>
                      <TableHead>Handlinger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.budgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>{budget.name}</TableCell>
                        <TableCell>{budget.year}</TableCell>
                        <TableCell>{budget.month}</TableCell>
                        <TableCell>{budget.total_income} DKK</TableCell>
                        <TableCell>{budget.total_expenses} DKK</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRecord('budgets', budget.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gældspositioner</CardTitle>
                <CardDescription>Se og administrer alle gældspositioner</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kreditor</TableHead>
                      <TableHead>Nuværende saldo</TableHead>
                      <TableHead>Oprindeligt beløb</TableHead>
                      <TableHead>Rente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Handlinger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.debts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>{debt.creditor_name}</TableCell>
                        <TableCell>{debt.current_balance} DKK</TableCell>
                        <TableCell>{debt.original_amount} DKK</TableCell>
                        <TableCell>{debt.interest_rate}%</TableCell>
                        <TableCell>
                          <Badge variant={debt.status === 'active' ? 'default' : 'secondary'}>
                            {debt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRecord('debts', debt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chat Samtaler</CardTitle>
                <CardDescription>Se og administrer alle chat samtaler</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Bruger ID</TableHead>
                      <TableHead>Oprettet</TableHead>
                      <TableHead>Opdateret</TableHead>
                      <TableHead>Handlinger</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userData.conversations.map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell className="font-mono text-sm">
                          {conversation.session_id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {conversation.user_id?.substring(0, 8) || 'Anonym'}...
                        </TableCell>
                        <TableCell>{new Date(conversation.created_at).toLocaleDateString('da-DK')}</TableCell>
                        <TableCell>{new Date(conversation.updated_at).toLocaleDateString('da-DK')}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteRecord('chat_conversations', conversation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;