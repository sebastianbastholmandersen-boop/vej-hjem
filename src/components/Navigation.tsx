import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "./UserMenu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading } = useAuth();

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

  const toolItems = [
    { label: "Gældskalkulator", path: "/gaeldskalkulator" },
    { label: "Selvvurdering", path: "/selvvurdering" },
    { label: "Budgetplanner", path: "/budgetplan" }
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
              GældVej
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
            
            {/* Værktøjer dropdown */}
            <div className="relative group">
              <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1">
                Værktøjer
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-card border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {toolItems.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors duration-200"
                    >
                      {tool.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => scrollToSection('ai-chat')}
                    className="bg-gradient-hero hover:shadow-soft rounded-xl"
                  >
                    Få hjælp nu
                  </Button>
                  <UserMenu />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => scrollToSection('ai-chat')}
                    className="bg-gradient-hero hover:shadow-soft rounded-xl"
                  >
                    Få hjælp nu
                  </Button>
                  <Link to="/auth">
                    <Button variant="outline" className="bg-secondary/50 hover:bg-secondary border-border/50">
                      Log ind
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {!loading && user && <UserMenu />}
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
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
              
              {/* Mobile værktøjer */}
              <div className="border-t border-border/50 pt-3 mt-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 px-2">Værktøjer</p>
                {toolItems.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className="block py-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {tool.label}
                  </Link>
                ))}
              </div>
              
              <Button 
                onClick={() => scrollToSection('ai-chat')}
                className="bg-gradient-hero hover:shadow-soft rounded-xl mt-2"
              >
                Få hjælp nu
              </Button>
              {!loading && !user && (
                <Link to="/auth">
                  <Button variant="outline" className="w-full mt-2 bg-secondary/50 hover:bg-secondary border-border/50">
                    Log ind
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;