import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Crown, AlertTriangle } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface CardLimitWarningProps {
  onUpgrade: () => void;
}

export const CardLimitWarning = ({ onUpgrade }: CardLimitWarningProps) => {
  const { subscription, isTrial } = useSubscription();

  if (!isTrial) return null;

  const remainingCards = subscription.limits.maxCards - subscription.cardsCreated;
  const isNearLimit = remainingCards <= 2;
  const isAtLimit = remainingCards <= 0;

  if (isAtLimit) {
    return (
      <Alert className="border-red-500/20 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-red-800">
            You've reached your limit of {subscription.limits.maxCards} study cards. 
            Upgrade to Pro for unlimited cards!
          </span>
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="ml-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
          >
            <Crown className="w-3 h-3 mr-1" />
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isNearLimit) {
    return (
      <Alert className="border-yellow-500/20 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-yellow-800">
            You have {remainingCards} study cards remaining. 
            Upgrade to Pro for unlimited cards!
          </span>
          <Button 
            size="sm" 
            onClick={onUpgrade}
            className="ml-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
          >
            <Crown className="w-3 h-3 mr-1" />
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
