import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Zap, Lock, CheckCircle } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

export const SubscriptionStatus = () => {
  const { subscription, isTrial, isPro, upgradeToPro } = useSubscription();

  if (isPro) {
    return (
      <Card className="border-2 border-yellow-500/20 bg-gradient-to-r from-yellow-50 to-amber-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              Pro Plan
            </CardTitle>
            <Badge variant="default" className="bg-yellow-600 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Pro
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Unlimited games and study cards</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Access to all 14 game modes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Advanced analytics and progress tracking</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Trial Plan
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Trial
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Games played:</span>
            <span className="font-medium">
              {subscription.gamesPlayed} / {subscription.limits.maxGames}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Study cards:</span>
            <span className="font-medium">
              {subscription.cardsCreated} / {subscription.limits.maxCards}
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-blue-700 mb-3">
            <CheckCircle className="w-4 h-4" />
            <span>Access to 5 basic game modes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Lock className="w-4 h-4" />
            <span>9 advanced games require Pro</span>
          </div>
        </div>

        <Button 
          onClick={upgradeToPro}
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
        >
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  );
};
