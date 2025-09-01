import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { HandHeart, Mail, Phone, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Indtast din e-mail",
        description: "Vi har brug for din e-mail for at kunne hjælpe dig.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Tak for din besked!",
      description: "Vi kontakter dig inden for 24 timer med hjælp til din situation.",
    });

    setEmail("");
    setMessage("");
  };

  return (
    <section className="py-20 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-trust rounded-2xl shadow-soft">
              <HandHeart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-light text-foreground mb-4">
            Klar til at finde en aftale?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi hjælper dig i kontakt med det rette selskab, så I sammen kan finde en løsning, der virker for dig.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <Card className="p-8 shadow-card border-border/50">
            <h3 className="text-2xl font-medium text-foreground mb-6">
              Få personlig hjælp
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Din e-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@email.dk"
                  className="rounded-xl border-border/50 focus:ring-primary/20"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Beskriv kort din situation (valgfrit)
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Fortæl os lidt om din gældssituation, så vi bedre kan hjælpe dig..."
                  className="rounded-xl border-border/50 focus:ring-primary/20 min-h-[120px]"
                  rows={4}
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-gradient-trust hover:shadow-soft transform hover:scale-[1.02] transition-all duration-300 rounded-xl py-6"
              >
                Send besked - få hjælp nu
              </Button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Dine oplysninger behandles fortroligt og sikkert</span>
              </div>
            </div>
          </Card>

          {/* Contact info and trust signals */}
          <div className="space-y-8">
            <Card className="p-6 shadow-card border-border/50 bg-secondary/30">
              <h4 className="text-lg font-medium text-foreground mb-4">
                Sådan hjælper vi dig
              </h4>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-accent">1</span>
                  </div>
                  <p>Vi gennemgår din situation og finder de bedste muligheder</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-accent">2</span>
                  </div>
                  <p>Vi forbinder dig med pålidelige partnere, der kan hjælpe</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-accent">3</span>
                  </div>
                  <p>Du får støtte til at finde en løsning, der passer til dig</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 shadow-card border-border/50 text-center">
                <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
                <h5 className="font-medium text-foreground text-sm">E-mail</h5>
                <p className="text-xs text-muted-foreground">info@gaeldvej.dk</p>
              </Card>
              <Card className="p-4 shadow-card border-border/50 text-center">
                <Phone className="w-6 h-6 text-primary mx-auto mb-2" />
                <h5 className="font-medium text-foreground text-sm">Telefon</h5>
                <p className="text-xs text-muted-foreground">+45 70 XX XX XX</p>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground italic">
                Vi svarer typisk inden for 2-4 timer på hverdage
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;