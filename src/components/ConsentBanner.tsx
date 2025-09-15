import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, X } from 'lucide-react';
import { useDataCollection } from '@/hooks/useDataCollection';

interface ConsentBannerProps {
  onConsent?: (consented: boolean) => void;
}

const ConsentBanner = ({ onConsent }: ConsentBannerProps) => {
  const { hasConsented, saveConsent } = useDataCollection();
  const [isVisible, setIsVisible] = useState(hasConsented === null);

  if (!isVisible || hasConsented !== null) {
    return null;
  }

  const handleConsent = (consented: boolean) => {
    saveConsent(consented);
    setIsVisible(false);
    onConsent?.(consented);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto">
      <Card className="shadow-lg border border-accent/20 bg-card/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
              <Info className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Hjælp os med at forbedre GældVej
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vi vil gerne indsamle anonyme data om hvordan du bruger vores værktøjer 
                  for at kunne forbedre dem. Dine data behandles fortroligt og bruges kun 
                  til at skabe bedre værktøjer til gældsrådgivning.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => handleConsent(true)}
                  className="bg-gradient-hero text-white"
                  size="sm"
                >
                  Ja, del data anonymt
                </Button>
                <Button
                  onClick={() => handleConsent(false)}
                  variant="outline"
                  size="sm"
                >
                  Nej tak
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Du kan altid ændre dette valg senere i indstillingerne.
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentBanner;