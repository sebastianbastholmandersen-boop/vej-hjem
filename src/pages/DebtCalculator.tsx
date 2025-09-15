import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator, PlusCircle, Trash2, AlertCircle, Lock, UserPlus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToolSession } from "@/hooks/useToolSession";
import ConsentDialog from "@/components/ConsentDialog";

interface Debt {
  id: number;
  name: string;
  balance: number;
  minPayment: number;
  interestRate: number;
}

const DebtCalculator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sessionId, saveToolSession, updateSessionData } = useToolSession();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [newDebt, setNewDebt] = useState({
    name: "",
    balance: "",
    minPayment: "",
    interestRate: ""
  });
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [hasShownConsent, setHasShownConsent] = useState(false);

  // Show consent dialog when user first interacts with tool
  useEffect(() => {
    if (debts.length > 0 && !hasShownConsent) {
      setShowConsentDialog(true);
      setHasShownConsent(true);
    }
  }, [debts.length, hasShownConsent]);

  // Update session data when debts change
  useEffect(() => {
    if (sessionId && debts.length > 0) {
      const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
      const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
      const averageInterestRate = debts.length > 0 
        ? debts.reduce((sum, debt) => sum + (debt.interestRate * debt.balance), 0) / totalDebt
        : 0;
      updateSessionData(sessionId, { debts, totalDebt, totalMinPayments, averageInterestRate });
    }
  }, [debts, sessionId, updateSessionData]);

  const handleConsentResponse = async (consented: boolean) => {
    setShowConsentDialog(false);
    await saveToolSession('debt_calculator', { debts }, consented);
  };

  const addDebt = () => {
    // Check if user is not authenticated and already has 1 debt
    if (!user && debts.length >= 1) {
      return; // Don't add more debts for non-authenticated users
    }

    if (newDebt.name && newDebt.balance && newDebt.minPayment && newDebt.interestRate) {
      const debt: Debt = {
        id: Date.now(),
        name: newDebt.name,
        balance: parseFloat(newDebt.balance),
        minPayment: parseFloat(newDebt.minPayment),
        interestRate: parseFloat(newDebt.interestRate)
      };
      setDebts([...debts, debt]);
      setNewDebt({ name: "", balance: "", minPayment: "", interestRate: "" });
    }
  };

  const removeDebt = (id: number) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinPayments = debts.reduce((sum, debt) => sum + debt.minPayment, 0);
  const averageInterestRate = debts.length > 0 
    ? debts.reduce((sum, debt) => sum + (debt.interestRate * debt.balance), 0) / totalDebt
    : 0;

  const calculatePayoffTime = (extraPayment: number = 0) => {
    if (debts.length === 0) return 0;
    
    // Simplified calculation - assumes avalanche method (highest interest first)
    let totalMonths = 0;
    const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
    let remainingExtra = extraPayment;
    
    for (const debt of sortedDebts) {
      const monthlyRate = debt.interestRate / 100 / 12;
      const payment = debt.minPayment + remainingExtra;
      
      if (monthlyRate === 0) {
        totalMonths = Math.max(totalMonths, debt.balance / payment);
      } else {
        const months = -Math.log(1 - (debt.balance * monthlyRate) / payment) / Math.log(1 + monthlyRate);
        totalMonths = Math.max(totalMonths, months);
      }
      
      remainingExtra = 0; // All extra payment goes to highest interest debt first
    }
    
    return totalMonths;
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-3 bg-gradient-hero rounded-2xl shadow-soft">
                <Calculator className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
              Gæld<span className="bg-gradient-hero bg-clip-text text-transparent font-medium">skalkulator</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Få overblik over din gæld og se hvordan forskellige betalingsstrategier påvirker din gældfrihed
            </p>
          </div>

          <Tabs defaultValue="input" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="input">Indtast gæld</TabsTrigger>
              <TabsTrigger value="analysis">Analyse & Strategier</TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-accent" />
                    Tilføj gæld
                  </CardTitle>
                  <CardDescription>
                    Indtast information om dine gældsposter for at få et komplet overblik
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="debtName">Kreditor navn</Label>
                    <Input
                      id="debtName"
                      placeholder="F.eks. Kreditkort, Banklån..."
                      value={newDebt.name}
                      onChange={(e) => setNewDebt({...newDebt, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balance">Gældsaldo (kr.)</Label>
                    <Input
                      id="balance"
                      type="number"
                      placeholder="50000"
                      value={newDebt.balance}
                      onChange={(e) => setNewDebt({...newDebt, balance: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minPayment">Minimum betaling (kr.)</Label>
                    <Input
                      id="minPayment"
                      type="number"
                      placeholder="1500"
                      value={newDebt.minPayment}
                      onChange={(e) => setNewDebt({...newDebt, minPayment: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Rente (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="8.5"
                      value={newDebt.interestRate}
                      onChange={(e) => setNewDebt({...newDebt, interestRate: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-4">
                    {!user && debts.length >= 1 ? (
                      <Card className="bg-gradient-hero text-white p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Lock className="w-5 h-5" />
                          <h3 className="font-semibold">Opret bruger for flere gældsposter</h3>
                        </div>
                        <p className="text-sm opacity-90 mb-4">
                          Du kan kun tilføje én gæld som gæst. Opret en gratis bruger for at få adgang til alle funktioner.
                        </p>
                        <Button 
                          onClick={() => navigate('/auth')} 
                          variant="secondary" 
                          className="w-full bg-white text-primary hover:bg-gray-100"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Opret bruger gratis
                        </Button>
                      </Card>
                    ) : (
                      <Button onClick={addDebt} className="w-full bg-gradient-hero">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Tilføj gæld
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {debts.length > 0 && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Dine gældsposter</CardTitle>
                    <CardDescription>Oversigt over din nuværende gæld</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {debts.map((debt) => (
                      <div key={debt.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="font-medium text-foreground">{debt.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Saldo</p>
                            <p className="font-medium">{debt.balance.toLocaleString('da-DK')} kr.</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Min. betaling</p>
                            <p className="font-medium">{debt.minPayment.toLocaleString('da-DK')} kr.</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Rente</p>
                              <Badge variant="outline">{debt.interestRate}%</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDebt(debt.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              {debts.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">
                      Tilføj dine gældsposter først for at se analyse og strategier
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="shadow-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Samlet gæld</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-foreground">
                          {totalDebt.toLocaleString('da-DK')} kr.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Månedlige betalinger</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-foreground">
                          {totalMinPayments.toLocaleString('da-DK')} kr.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Gennemsnitsrente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-foreground">
                          {averageInterestRate.toFixed(1)}%
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle>Nedbetalingsstrategier</CardTitle>
                      <CardDescription>
                        Se hvordan forskellige strategier påvirker din gældfrihed
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 bg-gradient-soft rounded-2xl">
                          <h3 className="font-semibold text-foreground mb-2">Kun minimum betalinger</h3>
                          <p className="text-2xl font-bold text-foreground mb-2">
                            {Math.ceil(calculatePayoffTime(0))} måneder
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ved at betale kun minimum betalinger
                          </p>
                        </div>

                        <div className="p-6 bg-gradient-hero rounded-2xl text-white">
                          <h3 className="font-semibold mb-2">Med 1000 kr. ekstra månedligt</h3>
                          <p className="text-2xl font-bold mb-2">
                            {Math.ceil(calculatePayoffTime(1000))} måneder
                          </p>
                          <p className="text-sm opacity-90">
                            Spar {Math.ceil(calculatePayoffTime(0)) - Math.ceil(calculatePayoffTime(1000))} måneder!
                          </p>
                        </div>
                      </div>

                      <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20">
                        <h3 className="font-semibold text-foreground mb-3">💡 Anbefaling</h3>
                        <p className="text-muted-foreground">
                          Prioriter gæld med højeste rente først (avalanche metoden). 
                          Start med {debts.sort((a, b) => b.interestRate - a.interestRate)[0]?.name} 
                          som har {debts.sort((a, b) => b.interestRate - a.interestRate)[0]?.interestRate}% i rente.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <ConsentDialog
        isOpen={showConsentDialog}
        onClose={handleConsentResponse}
        toolName="debt_calculator"
      />
    </div>
  );
};

export default DebtCalculator;