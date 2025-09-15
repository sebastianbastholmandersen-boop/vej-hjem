import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, HelpCircle, PieChart, ArrowRight } from "lucide-react";

const tools = [
  {
    title: "Gældskalkulator",
    description: "Få overblik over din gæld og se hvordan forskellige betalingsstrategier påvirker din gældfrihed",
    icon: Calculator,
    path: "/gaeldskalkulator",
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "Selvvurderings-quiz",
    description: "Vurder din gældssituation med vores omfattende quiz og få personlige anbefalinger",
    icon: HelpCircle,
    path: "/selvvurdering",
    color: "bg-green-100 text-green-700"
  },
  {
    title: "Budgetplanlægger",
    description: "Skab overblik over din økonomi og planlæg vejen til bedre finansiel sundhed",
    icon: PieChart,
    path: "/budgetplan",
    color: "bg-purple-100 text-purple-700"
  }
];

const ToolsSection = () => {
  return (
    <section className="py-20 px-6 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-foreground mb-6">
            Praktiske{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent font-medium">
              værktøjer
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Brug vores gratis værktøjer til at få bedre kontrol over din gæld og økonomi
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={index} 
                className="shadow-card hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border-border/50"
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${tool.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link to={tool.path}>
                    <Button 
                      className="w-full bg-gradient-hero hover:shadow-soft rounded-xl group"
                    >
                      Prøv værktøjet
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Har du brug for personlig rådgivning?
          </p>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => {
              const chatSection = document.getElementById('ai-chat');
              chatSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-secondary/50 hover:bg-secondary border-border/50 px-8"
          >
            Chat med vores AI-rådgiver
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;