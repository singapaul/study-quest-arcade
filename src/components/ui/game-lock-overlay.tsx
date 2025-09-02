import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Crown, Zap } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface GameLockOverlayProps {
  gameName: string;
  gameDescription: string;
  onUpgrade: () => void;
}

export const GameLockOverlay = ({ gameName, gameDescription, onUpgrade }: GameLockOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
      <Card className="max-w-sm mx-4 border-2 border-yellow-500/20">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-yellow-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{gameName}</h3>
            <p className="text-sm text-muted-foreground mb-4">{gameDescription}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span>This game requires Pro subscription</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>Upgrade to unlock all 14 games</span>
            </div>
          </div>

          <Button 
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
