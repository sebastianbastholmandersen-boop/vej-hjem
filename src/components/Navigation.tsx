import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: "Hjem", id: "hero" },
    { label: "AI Chat", id: "ai-chat" },
    { label: "Ordbog", id: "glossary" },
    { label: "Kontakt", id: "contact" },
    { label: "Om os", id: "about" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => scrollToSection('hero')}
          >
            <div className="p-2 bg-gradient-hero rounded-lg shadow-soft">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-medium text-foreground">
              Gæld Assistent
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <Button 
              onClick={() => scrollToSection('ai-chat')}
              className="bg-gradient-hero hover:shadow-soft rounded-xl"
            >
              Få hjælp nu
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection('ai-chat')}
                className="bg-gradient-hero hover:shadow-soft rounded-xl mt-2"
              >
                Få hjælp nu
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;