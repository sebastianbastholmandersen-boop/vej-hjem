import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Search, Trash2, Shield, UserCheck, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  user_id: string;
  user_type: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  cvr_number?: string;
  phone?: string;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface Budget {
  id: string;
  user_id: string;
  name: string;
  year: number;
  month: number;
  total_income?: number;
  total_expenses?: number;
  created_at: string;
}

interface Debt {
  id: string;
  user_id: string;
  creditor_name: string;
  original_amount: number;
  current_balance: number;
  status: string;
  created_at: string;
}

const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('user');

  useEffect(() => {
    if (adminLoading) return;
    
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }

    fetchAllData();
  }, [user, isAdmin, adminLoading, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [profilesRes, budgetsRes, debtsRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('budgets').select('*').order('created_at', { ascending: false }),
        supabase.from('debts').select('*').order('created_at', { ascending: false }),
        supabase.from('user_roles').select('*')
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (budgetsRes.error) throw budgetsRes.error;
      if (debtsRes.error) throw debtsRes.error;
      if (rolesRes.error) throw rolesRes.error;

      setProfiles(profilesRes.data || []);
      setBudgets(budgetsRes.data || []);
      setDebts(debtsRes.data || []);
      setUserRoles(rolesRes.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Fejl",
        description: "Kunne ikke hente admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profil slettet succesfuldt"
      });
      
      fetchAllData();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Fejl",
        description: "Kunne ikke slette profil",
        variant: "destructive"
      });
    }
  };

  const assignRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: selectedUser, role: newRole as 'admin' | 'user' });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Rolle tildelt succesfuldt"
      });
      
      setSelectedUser('');
      setNewRole('user');
      fetchAllData();
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Fejl",
        description: "Kunne ikke tildele rolle",
        variant: "destructive"
      });
    }
  };

  const exportData = async (tableName: 'profiles' | 'budgets' | 'debts' | 'user_roles') => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) throw error;

      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${tableName}_export_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Success",
        description: `${tableName} data eksporteret succesfuldt`
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Fejl",
        description: "Kunne ikke eksportere data",
        variant: "destructive"
      });
    }
  };

  const filteredProfiles = profiles.filter(profile => 
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.cvr_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || 'user';
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Indlæser admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Administrer brugere og data</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Tilbage til hovedside
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Søg i brugere..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Brugere</TabsTrigger>
            <TabsTrigger value="budgets">Budgetter</TabsTrigger>
            <TabsTrigger value="debts">Gæld</TabsTrigger>
            <TabsTrigger value="roles">Roller</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Bruger Administration</CardTitle>
                    <CardDescription>Administrer alle brugerprofiler</CardDescription>
                  </div>
                  <Button onClick={() => exportData('profiles')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Eksporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Navn</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>CVR</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Rolle</TableHead>
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
                            : profile.company_name || 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.user_type === 'company' ? 'default' : 'secondary'}>
                            {profile.user_type === 'company' ? 'Virksomhed' : 'Privatperson'}
                          </Badge>
                        </TableCell>
                        <TableCell>{profile.cvr_number || 'N/A'}</TableCell>
                        <TableCell>{profile.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={getUserRole(profile.user_id) === 'admin' ? 'destructive' : 'outline'}>
                            <Shield className="w-3 h-3 mr-1" />
                            {getUserRole(profile.user_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(profile.created_at).toLocaleDateString('da-DK')}</TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Er du sikker?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Dette vil permanent slette brugerprofilen og alle tilknyttede data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuller</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteProfile(profile.id)}>
                                  Slet
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Budget Administration</CardTitle>
                    <CardDescription>Se alle bruger budgetter</CardDescription>
                  </div>
                  <Button onClick={() => exportData('budgets')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Eksporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Budget Navn</TableHead>
                      <TableHead>År/Måned</TableHead>
                      <TableHead>Indtægter</TableHead>
                      <TableHead>Udgifter</TableHead>
                      <TableHead>Oprettet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgets.map((budget) => (
                      <TableRow key={budget.id}>
                        <TableCell>{budget.name}</TableCell>
                        <TableCell>{budget.year}/{budget.month}</TableCell>
                        <TableCell>{budget.total_income?.toLocaleString('da-DK')} kr</TableCell>
                        <TableCell>{budget.total_expenses?.toLocaleString('da-DK')} kr</TableCell>
                        <TableCell>{new Date(budget.created_at).toLocaleDateString('da-DK')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debts">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gæld Administration</CardTitle>
                    <CardDescription>Se alle bruger gæld</CardDescription>
                  </div>
                  <Button onClick={() => exportData('debts')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Eksporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kreditor</TableHead>
                      <TableHead>Oprindeligt Beløb</TableHead>
                      <TableHead>Nuværende Saldo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Oprettet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {debts.map((debt) => (
                      <TableRow key={debt.id}>
                        <TableCell>{debt.creditor_name}</TableCell>
                        <TableCell>{debt.original_amount.toLocaleString('da-DK')} kr</TableCell>
                        <TableCell>{debt.current_balance.toLocaleString('da-DK')} kr</TableCell>
                        <TableCell>
                          <Badge variant={debt.status === 'active' ? 'destructive' : 'secondary'}>
                            {debt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(debt.created_at).toLocaleDateString('da-DK')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Rolle Administration</CardTitle>
                <CardDescription>Administrer bruger roller</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 border rounded-lg">
                  <h3 className="font-semibold mb-4">Tildel Rolle</h3>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Vælg Bruger</label>
                      <Select value={selectedUser} onValueChange={setSelectedUser}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vælg en bruger" />
                        </SelectTrigger>
                        <SelectContent>
                          {profiles.map((profile) => (
                            <SelectItem key={profile.user_id} value={profile.user_id}>
                              {profile.user_type === 'individual' 
                                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                                : profile.company_name || 'N/A'
                              }
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Rolle</label>
                      <Select value={newRole} onValueChange={setNewRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">Bruger</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={assignRole} disabled={!selectedUser}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Tildel Rolle
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bruger</TableHead>
                      <TableHead>Rolle</TableHead>
                      <TableHead>Tildelt Dato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((userRole) => {
                      const profile = profiles.find(p => p.user_id === userRole.user_id);
                      return (
                        <TableRow key={userRole.id}>
                          <TableCell>
                            {profile ? (
                              profile.user_type === 'individual' 
                                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                                : profile.company_name || 'N/A'
                            ) : 'Ukendt bruger'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={userRole.role === 'admin' ? 'destructive' : 'outline'}>
                              <Shield className="w-3 h-3 mr-1" />
                              {userRole.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(userRole.created_at).toLocaleDateString('da-DK')}</TableCell>
                        </TableRow>
                      );
                    })}
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

export default Admin;