import { Card } from "@/components/ui/card";
import { BookOpen, ChevronRight } from "lucide-react";

const GlossarySection = () => {
  const glossaryTerms = [
    {
      term: "Debitor",
      definition: "Det er dig - personen der skylder penge. Helt enkelt: du er debitor når du har gæld til nogen."
    },
    {
      term: "Kreditor", 
      definition: "Den person eller virksomhed du skylder penge til. Det kan være din bank, et kreditkortselskab eller en butik."
    },
    {
      term: "Inkasso",
      definition: "Når en virksomhed hjælper med at inddrive penge, du skylder. Det er ikke farligt - det er bare en måde at få struktur på gælden."
    },
    {
      term: "Afdragsordning",
      definition: "En aftale om at betale din gæld tilbage i mindre beløb over længere tid. Som at betale 1000kr om måneden i stedet for 12.000kr på én gang."
    },
    {
      term: "Betalingsaftale",
      definition: "En aftale mellem dig og den du skylder penge, om hvordan og hvornår du betaler. Det er en måde at få mere tid på."
    },
    {
      term: "Restance",
      definition: "Penge du skylder, som skulle være betalt for længe siden. Restance betyder bare, at betalingen er forsinket."
    },
    {
      term: "Påkrav",
      definition: "Et brev der minder dig om, at du skylder penge. Det er første skridt, før sagen eventuelt går til inkasso."
    },
    {
      term: "Rykker",
      definition: "En venlig reminder om betaling. Hvis du får en rykker, betyder det bare, at virksomheden gerne vil have deres penge."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-trust rounded-2xl shadow-soft">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-light text-foreground mb-4">
            Ordbog til hverdagssprog
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Her forklarer vi de svære ord på en måde, alle kan forstå. Ingen jurasprog - kun klare forklaringer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {glossaryTerms.map((item, index) => (
            <Card 
              key={index} 
              className="p-6 shadow-card border-border/50 hover:shadow-soft transition-all duration-300 bg-card/80 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-medium text-foreground">
                  {item.term}
                </h3>
                <ChevronRight className="w-5 h-5 text-accent mt-1" />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {item.definition}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground italic">
            Har du brug for forklaring på andre ord? Spørg bare i chatten ovenfor.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GlossarySection;