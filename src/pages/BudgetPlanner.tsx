import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, PlusCircle, Trash2, TrendingUp, TrendingDown, DollarSign, Wallet, Lock, UserPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToolSession } from "@/hooks/useToolSession";
import ConsentDialog from "@/components/ConsentDialog";

interface BudgetItem {
  id: number;
  name: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  name: string;
  color: string;
  type: 'income' | 'expense';
}

const categories: BudgetCategory[] = [
  // Income categories
  { name: 'Løn', color: '#10B981', type: 'income' },
  { name: 'Freelance', color: '#059669', type: 'income' },
  { name: 'Investeringer', color: '#047857', type: 'income' },
  { name: 'Andet indkomst', color: '#065F46', type: 'income' },
  
  // Expense categories
  { name: 'Bolig', color: '#EF4444', type: 'expense' },
  { name: 'Transport', color: '#F97316', type: 'expense' },
  { name: 'Mad', color: '#EAB308', type: 'expense' },
  { name: 'Forsikringer', color: '#8B5CF6', type: 'expense' },
  { name: 'Gæld & lån', color: '#EC4899', type: 'expense' },
  { name: 'Entertainment', color: '#06B6D4', type: 'expense' },
  { name: 'Tøj & shopping', color: '#84CC16', type: 'expense' },
  { name: 'Sundhed', color: '#F59E0B', type: 'expense' },
  { name: 'Opsparing', color: '#10B981', type: 'expense' },
  { name: 'Andet udgifter', color: '#6B7280', type: 'expense' }
];

const BudgetPlanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessionId, saveToolSession, updateSessionData } = useToolSession();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    amount: "",
    category: "",
    type: "income" as 'income' | 'expense'
  });
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [hasShownConsent, setHasShownConsent] = useState(false);

  // Show consent dialog when user first interacts with tool
  useEffect(() => {
    if (items.length > 0 && !hasShownConsent) {
      setShowConsentDialog(true);
      setHasShownConsent(true);
    }
  }, [items.length, hasShownConsent]);

  // Update session data when items change
  useEffect(() => {
    if (sessionId && items.length > 0) {
      const totalIncome = items.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = items.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
      const netIncome = totalIncome - totalExpenses;
      updateSessionData(sessionId, { items, totalIncome, totalExpenses, netIncome });
    }
  }, [items, sessionId, updateSessionData]);

  const handleConsentResponse = async (consented: boolean) => {
    setShowConsentDialog(false);
    await saveToolSession('budget_planner', { items }, consented);
  };

  const addItem = () => {
    // Check if user is not authenticated and already has 1 item
    if (!user && items.length >= 1) {
      return; // Don't add more items for non-authenticated users
    }

    if (newItem.name && newItem.amount && newItem.category) {
      const item: BudgetItem = {
        id: Date.now(),
        name: newItem.name,
        amount: parseFloat(newItem.amount),
        category: newItem.category,
        type: newItem.type
      };
      setItems([...items, item]);
      setNewItem({ name: "", amount: "", category: "", type: "income" });
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalIncome = items.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = items.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0;

  const expensesByCategory = items
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {} as Record<string, number>);

  const getCategoryColor = (categoryName: string) => {
    return categories.find(cat => cat.name === categoryName)?.color || '#6B7280';
  };

  const getAvailableCategories = () => {
    return categories.filter(cat => cat.type === newItem.type);
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-3 bg-gradient-hero rounded-2xl shadow-soft">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
              Budget<span className="bg-gradient-hero bg-clip-text text-transparent font-medium">planlægger</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Skab overblik over din økonomi og planlæg vejen til bedre finansiel sundhed
            </p>
          </div>

          <Tabs defaultValue="input" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="input">Indtast budget</TabsTrigger>
              <TabsTrigger value="overview">Overblik</TabsTrigger>
              <TabsTrigger value="analysis">Analyse</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-accent" />
                    Tilføj budgetpost
                  </CardTitle>
                  <CardDescription>
                    Indtast dine indtægter og udgifter for at få et komplet budget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Navn</Label>
                      <Input
                        id="itemName"
                        placeholder="F.eks. Løn, Husleje..."
                        value={newItem.name}
                        onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Beløb (kr.)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="5000"
                        value={newItem.amount}
                        onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={newItem.type}
                        onValueChange={(value: 'income' | 'expense') => setNewItem({...newItem, type: value, category: ""})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Vælg type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="income">Indtægt</SelectItem>
                          <SelectItem value="expense">Udgift</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({...newItem, category: value})}
                        disabled={!newItem.type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Vælg kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCategories().map(category => (
                            <SelectItem key={category.name} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      {!user && items.length >= 1 ? (
                        <Card className="bg-gradient-hero text-white p-4 w-full">
                          <div className="flex items-center gap-3 mb-3">
                            <Lock className="w-5 h-5" />
                            <h3 className="font-semibold text-sm">Opret bruger for flere poster</h3>
                          </div>
                          <p className="text-xs opacity-90 mb-4">
                            Kun én budgetpost som gæst. Opret gratis bruger for ubegrænset adgang.
                          </p>
                          <Button 
                            onClick={() => navigate('/auth')} 
                            variant="secondary" 
                            className="w-full bg-white text-primary hover:bg-gray-100 text-sm py-2"
                          >
                            <UserPlus className="w-3 h-3 mr-2" />
                            Opret bruger
                          </Button>
                        </Card>
                      ) : (
                        <Button onClick={addItem} className="w-full bg-gradient-hero">
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Tilføj
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {items.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Dine budgetposter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getCategoryColor(item.category) }}
                          />
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`font-medium ${item.type === 'income' ? 'text-green-600' : 'text-foreground'}`}>
                              {item.type === 'income' ? '+' : ''}{item.amount.toLocaleString('da-DK')} kr.
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'income' ? 'Indtægt' : 'Udgift'}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-4">
                <Card className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Samlet indtægt</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {totalIncome.toLocaleString('da-DK')} kr.
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Samlet udgifter</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {totalExpenses.toLocaleString('da-DK')} kr.
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nettoindkomst</CardTitle>
                    <DollarSign className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netIncome.toLocaleString('da-DK')} kr.
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Opsparingsrate</CardTitle>
                    <PieChart className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {savingsRate.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              {Object.keys(expensesByCategory).length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Udgifter per kategori</CardTitle>
                    <CardDescription>Fordeling af dine månedlige udgifter</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(expensesByCategory).map(([category, amount]) => {
                      const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getCategoryColor(category) }}
                              />
                              <span className="text-sm font-medium">{category}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">{amount.toLocaleString('da-DK')} kr.</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={percentage}
                            className="h-2"
                            style={{
                              '--progress-background': getCategoryColor(category)
                            } as React.CSSProperties}
                          />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Budget analyse</CardTitle>
                  <CardDescription>Anbefalinger baseret på dit budget</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className={`p-6 rounded-2xl ${
                    netIncome >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${netIncome >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {netIncome >= 0 ? '✅ Positivt budget' : '⚠️ Negativt budget'}
                    </h3>
                    <p className={`text-sm ${netIncome >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {netIncome >= 0 
                        ? `Du har et overskud på ${netIncome.toLocaleString('da-DK')} kr. om måneden. Det er godt!`
                        : `Du har et underskud på ${Math.abs(netIncome).toLocaleString('da-DK')} kr. om måneden. Dette kræver handling.`
                      }
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-6 bg-gradient-soft rounded-2xl">
                      <h3 className="font-semibold text-foreground mb-3">50/30/20 regel</h3>
                      <div className="space-y-2 text-sm">
                        <p>50% til behov: {(totalIncome * 0.5).toLocaleString('da-DK')} kr.</p>
                        <p>30% til ønsker: {(totalIncome * 0.3).toLocaleString('da-DK')} kr.</p>
                        <p>20% til opsparing: {(totalIncome * 0.2).toLocaleString('da-DK')} kr.</p>
                      </div>
                    </div>

                    <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20">
                      <h3 className="font-semibold text-foreground mb-3">💡 Tips</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Gennemgå dine abonnementer</li>
                        <li>• Sammenlign priser på forsikringer</li>
                        <li>• Automatiser din opsparing</li>
                        <li>• Lav en nødopsparing først</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <ConsentDialog
        isOpen={showConsentDialog}
        onClose={handleConsentResponse}
        toolName="budget_planner"
      />
    </div>
  );
};

export default BudgetPlanner;