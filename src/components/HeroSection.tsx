import { Button } from "@/components/ui/button";
import heroImage from "@/assets/consultation-hero.jpg";

const HeroSection = () => {
  const scrollToChat = () => {
    const chatSection = document.getElementById('ai-chat');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-soft" />
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Person der får rådgivning om gæld i rolige omgivelser" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-light text-foreground mb-8 leading-tight">
          Gæld behøver ikke være{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent font-medium">
            uoverskueligt
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Vi hjælper dig trin for trin til at forstå din situation og finde løsninger, der passer til dig
        </p>
        <Button 
          size="lg" 
          onClick={scrollToChat}
          className="bg-gradient-hero hover:shadow-soft transform hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-2xl"
        >
          Få hjælp nu
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-accent/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
    </section>
  );
};

export default HeroSection;