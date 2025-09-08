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

        <div className="relative mb-16 h-[600px] md:h-[700px] flex items-center justify-center">
          {/* Pentagon layout container */}
          <div className="relative w-full max-w-4xl h-full">
            {/* Center decorative element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-hero rounded-full shadow-glow animate-pulse z-10"></div>
            
            {/* Pentagon points - each card positioned at pentagon vertices */}
            {values.map((value, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180); // 72 degrees apart, starting from top
              const radius = 220; // Distance from center
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              return (
                <Card 
                  key={index}
                  className="absolute w-64 h-64 p-6 shadow-card border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-soft hover:scale-105 transition-all duration-500 animate-fade-in flex flex-col"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className="flex flex-col items-center text-center h-full justify-between">
                    <div className="p-3 bg-gradient-hero rounded-xl shadow-soft mb-3 flex-shrink-0">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-lg font-medium text-foreground mb-3 line-clamp-2">
                        {value.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {/* Connecting lines to create pentagon shape */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="pentagonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {values.map((_, index) => {
                const angle1 = (index * 72 - 90) * (Math.PI / 180);
                const angle2 = ((index + 1) % 5 * 72 - 90) * (Math.PI / 180);
                const radius = 220;
                const x1 = Math.cos(angle1) * radius + 320; // Adjust for center
                const y1 = Math.sin(angle1) * radius + 300; // Adjust for center  
                const x2 = Math.cos(angle2) * radius + 320;
                const y2 = Math.sin(angle2) * radius + 300;
                
                return (
                  <line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#pentagonGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100 + 1000}ms` }}
                  />
                );
              })}
            </svg>

            {/* Floating decorative elements */}
            <div className="absolute top-10 left-10 w-8 h-8 bg-primary/10 rounded-full blur-sm animate-pulse" />
            <div className="absolute bottom-10 right-10 w-6 h-6 bg-accent/10 rounded-full blur-sm animate-pulse [animation-delay:1.5s]" />
            <div className="absolute top-1/3 right-16 w-4 h-4 bg-secondary/20 rounded-full blur-sm animate-pulse [animation-delay:2s]" />
          </div>

          {/* Mobile fallback - stack vertically on small screens */}
          <div className="block md:hidden absolute inset-0 bg-gradient-soft/50 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center h-full gap-4 px-4">
              {values.map((value, index) => (
                <Card 
                  key={index}
                  className="w-full max-w-sm p-4 shadow-card border-border/50 bg-card/80 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-hero rounded-lg shadow-soft flex-shrink-0">
                      <value.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-1">
                        {value.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
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