import { Card } from "@/components/ui/card";
import { Heart, Users, Shield, Scale } from "lucide-react";

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="p-6 shadow-card border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-soft transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-hero rounded-xl shadow-soft flex-shrink-0">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
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
      </div>
    </section>
  );
};

export default AboutSection;