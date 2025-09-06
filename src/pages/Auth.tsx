import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogIn, UserPlus } from "lucide-react";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cvrNumber, setCvrNumber] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        toast({
          title: "Login fejl",
          description: error.message === "Invalid login credentials" 
            ? "Forkert email eller adgangskode" 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Velkommen tilbage!",
          description: "Du er nu logget ind.",
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Der opstod en fejl",
        description: "Prøv venligst igen senere.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !confirmPassword) return;

    if (signupPassword !== confirmPassword) {
      toast({
        title: "Adgangskoder matcher ikke",
        description: "Sørg for at begge adgangskoder er ens.",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Adgangskode for kort",
        description: "Adgangskoden skal være mindst 6 karakterer lang.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields based on user type
    if (userType === 'individual') {
      if (!firstName.trim() || !lastName.trim()) {
        toast({
          title: "Manglende oplysninger",
          description: "Udfyld venligst både fornavn og efternavn.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!companyName.trim() || !cvrNumber.trim()) {
        toast({
          title: "Manglende oplysninger",
          description: "Udfyld venligst både virksomhedsnavn og CVR-nummer.",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      // Prepare metadata based on user type
      const userMetadata = {
        user_type: userType,
        ...(userType === 'individual' 
          ? { first_name: firstName.trim(), last_name: lastName.trim() }
          : { company_name: companyName.trim(), cvr_number: cvrNumber.trim() }
        )
      };
      
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: userMetadata
        }
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Bruger findes allerede",
            description: "Denne email er allerede registreret. Prøv at logge ind i stedet.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registrering fejl",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Registrering gennemført!",
          description: "Tjek din email for at bekræfte din konto.",
        });
        setSignupEmail("");
        setSignupPassword("");
        setConfirmPassword("");
        setFirstName("");
        setLastName("");
        setCompanyName("");
        setCvrNumber("");
      }
    } catch (error) {
      toast({
        title: "Der opstod en fejl",
        description: "Prøv venligst igen senere.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-white mb-2">
            Velkommen
          </h1>
          <p className="text-white/80">
            Log ind eller opret en konto for at komme i gang
          </p>
        </div>

        <Card className="p-8 shadow-card border-border/50">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Log ind
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Opret konto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="din@email.dk"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Adgangskode</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:shadow-soft"
                  disabled={loading || !loginEmail || !loginPassword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logger ind...
                    </>
                  ) : (
                    "Log ind"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-type">Jeg er</Label>
                  <Select value={userType} onValueChange={(value: 'individual' | 'company') => setUserType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg brugertype" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Privatperson</SelectItem>
                      <SelectItem value="company">Virksomhed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {userType === 'individual' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Fornavn</Label>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder="Dit fornavn"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Efternavn</Label>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder="Dit efternavn"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Virksomhedsnavn</Label>
                      <Input
                        id="company-name"
                        type="text"
                        placeholder="Virksomhedens navn"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvr-number">CVR-nummer</Label>
                      <Input
                        id="cvr-number"
                        type="text"
                        placeholder="12345678"
                        value={cvrNumber}
                        onChange={(e) => setCvrNumber(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="din@email.dk"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Adgangskode</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Bekræft adgangskode</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:shadow-soft"
                  disabled={loading || !signupEmail || !signupPassword || !confirmPassword}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Opretter konto...
                    </>
                  ) : (
                    "Opret konto"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            ← Tilbage til forside
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;