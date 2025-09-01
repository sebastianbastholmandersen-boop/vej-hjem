import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ChatSection from "@/components/ChatSection";
import GlossarySection from "@/components/GlossarySection";
import ContactSection from "@/components/ContactSection";
import AboutSection from "@/components/AboutSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        <ChatSection />
        <div id="glossary">
          <GlossarySection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
        <div id="about">
          <AboutSection />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm opacity-80">
            © 2024 GældVej. Vi hjælper mennesker med at forstå og håndtere gæld på en tryg måde.
          </p>
          <p className="text-xs opacity-60 mt-2">
            Udviklet med empati og respekt for alle, der har brug for hjælp.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
