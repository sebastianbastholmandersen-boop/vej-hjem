import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Info } from 'lucide-react';

interface ConsentDialogProps {
  isOpen: boolean;
  onClose: (consented: boolean) => void;
  toolName: string;
}

const ConsentDialog = ({ isOpen, onClose, toolName }: ConsentDialogProps) => {
  const [hasConsented, setHasConsented] = useState(false);

  const handleAccept = () => {
    onClose(true);
  };

  const handleDecline = () => {
    onClose(false);
  };

  const getToolDisplayName = (tool: string) => {
    switch (tool) {
      case 'debt_calculator': return 'Gældskalkulatoren';
      case 'budget_planner': return 'Budgetplanlæggeren';
      case 'debt_quiz': return 'Gældsvurderingen';
      default: return 'værktøjet';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle>Hjælp os med at forbedre vores tjenester</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-3">
            <p>
              Vi vil gerne indsamle anonyme data om hvordan du bruger {getToolDisplayName(toolName)} 
              for at forbedre vores tjenester og udvikle bedre værktøjer.
            </p>
            
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Hvad indsamler vi?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• De værdier du indtaster i værktøjet</li>
                    <li>• Hvilke funktioner du bruger</li>
                    <li>• Anonyme brugsstatistikker</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Din privatliv er beskyttet:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Ingen personlige oplysninger gemmes</li>
                  <li>• Data bruges kun til at forbedre tjenesten</li>
                  <li>• Du kan altid trække dit samtykke tilbage</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Checkbox
            id="consent"
            checked={hasConsented}
            onCheckedChange={(checked) => setHasConsented(checked as boolean)}
          />
          <label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Jeg giver samtykke til indsamling af anonyme data
          </label>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleDecline} className="flex-1">
            Nej tak
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!hasConsented}
            className="flex-1 bg-gradient-hero"
          >
            Acceptér og fortsæt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentDialog;