import { Card } from "@/components/ui/card";
import { Heart, Users, Shield, Scale, Brain, FileText } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Vi er på din side",
      description: "Vores mål er at hjælpe dig - ikke at skræmme eller presse dig. Vi tror på, at alle fortjener en chance for at komme videre."
    },
    {
      icon: Users,
      title: "Menneskelig tilgang",
      description: "Gæld er ikke bare tal - det handler om mennesker. Vi lytter til din situation og finder løsninger, der passer til dit liv."
    },
    {
      icon: Brain,
      title: "Ekspert-baseret AI",
      description: "Vores AI-assistent er trænet på tankegangen fra erfarne inkassomedarbejdere og gældsrådgivere, så du får praktiske og realistiske løsninger."
    },
    {
      icon: Shield,
      title: "Trygt og sikkert",
      description: "Dine oplysninger behandles fortroligt efter GDPR-reglerne. Vi deler kun det nødvendige med de partnere, der kan hjælpe dig."
    },
    {
      icon: Scale,
      title: "Neutral rådgivning",
      description: "Vi tjener ikke penge på at presse dig til dyre løsninger. Vores fokus er at finde den bedste vej frem for netop dig."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-foreground mb-4">
            Hvorfor kan du stole på os?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Vi er her for at gøre inkasso til noget, man kan forstå og handle på - uden stress og forvirring.
          </p>
        </div>

        <div className="relative mb-16">
          {/* Dynamic grid layout with different card sizes */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {/* Large featured card - first value */}
            <Card className="md:col-span-2 lg:col-span-3 p-8 shadow-card border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-soft hover:scale-[1.02] transition-all duration-500 animate-fade-in">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-gradient-hero rounded-2xl shadow-soft mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-medium text-foreground mb-4">
                  {values[0].title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {values[0].description}
                </p>
              </div>
            </Card>

            {/* Two medium cards - second and third values */}
            <Card className="md:col-span-2 lg:col-span-3 p-6 shadow-card border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-soft hover:scale-[1.02] transition-all duration-500 animate-fade-in [animation-delay:200ms]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-trust rounded-xl shadow-soft flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">
                    {values[1].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {values[1].description}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 p-6 shadow-card border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-soft hover:scale-[1.02] transition-all duration-500 animate-fade-in [animation-delay:400ms]">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-hero rounded-xl shadow-soft flex-shrink-0">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">
                    {values[2].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {values[2].description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Compact cards for last two values */}
            <Card className="md:col-span-2 lg:col-span-3 p-5 shadow-card border-border/50 bg-secondary/30 backdrop-blur-sm hover:shadow-soft hover:scale-[1.02] transition-all duration-500 animate-fade-in [animation-delay:600ms]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-trust rounded-lg shadow-soft flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {values[3].title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {values[3].description}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 p-5 shadow-card border-border/50 bg-accent/10 backdrop-blur-sm hover:shadow-soft hover:scale-[1.02] transition-all duration-500 animate-fade-in [animation-delay:800ms]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-hero rounded-lg shadow-soft flex-shrink-0">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {values[4].title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {values[4].description}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-primary/5 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent/5 rounded-full blur-lg animate-pulse [animation-delay:1s]" />
        </div>

        {/* Mission statement */}
        <Card className="p-8 shadow-card border-border/50 bg-card/60 backdrop-blur-sm text-center">
          <h3 className="text-2xl font-light text-foreground mb-6">
            Vores mission
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            At gøre gæld og inkasso til noget, alle kan forstå. Vi mener, at ingen skal føle sig alene eller forvirret, 
            når de står med økonomiske udfordringer. Derfor har vi skabt denne platform - et sted hvor du kan få 
            klare svar, menneskelig forståelse og praktisk hjælp.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border/50">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">GDPR-sikker</h4>
              <p className="text-xs text-muted-foreground">
                Dine data behandles sikkert og fortroligt efter alle gældende regler
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Neutral rådgivning</h4>
              <p className="text-xs text-muted-foreground">
                Vi har ingen skjulte agendaer - kun fokus på at hjælpe dig
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Gratis hjælp</h4>
              <p className="text-xs text-muted-foreground">
                Vores grundlæggende rådgivning er altid gratis og uforpligtende
              </p>
            </div>
          </div>
        </Card>

        {/* Ethics section */}
        <Card className="p-8 shadow-card border-border/50 bg-secondary/20 backdrop-blur-sm mt-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-trust rounded-xl shadow-soft">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-light text-foreground mb-4">
              Vores etiske tilgang
            </h3>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/80 rounded-2xl p-6 border border-border/30">
              <h4 className="text-lg font-medium text-foreground mb-4">
                Samtykke- og dataetik-erklæring
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Når du bruger vores AI, behandler vi kun de oplysninger, du selv deler. Dine data bruges til at give dig bedre svar og til anonymiseret statistik, 
                aldrig til at dømme eller presse dig. Du kan til enhver tid stoppe og få slettet dine oplysninger. Vores 
                AI er en neutral hjælper – ikke et inkassofirma – og vores mål er, at du føler dig set og forstået.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <h5 className="text-sm font-medium text-foreground mb-2">Din ret til kontrol</h5>
                <p className="text-xs text-muted-foreground">
                  Du bestemmer selv, hvad du deler, og kan altid få indsigt i eller slettet dine data
                </p>
              </div>
              <div className="text-center">
                <h5 className="text-sm font-medium text-foreground mb-2">Neutral hjælper</h5>
                <p className="text-xs text-muted-foreground">
                  Vi er ikke et inkassofirma - vi er kun her for at hjælpe dig forstå og handle
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutSection;