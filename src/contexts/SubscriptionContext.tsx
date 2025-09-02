import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SubscriptionInfo, SubscriptionTier, SUBSCRIPTION_LIMITS, GAME_TIERS } from '@/types/subscription';

interface SubscriptionContextType {
  subscription: SubscriptionInfo;
  isTrial: boolean;
  isPro: boolean;
  canPlayGame: (gameType: string) => boolean;
  canCreateCard: () => boolean;
  incrementGamesPlayed: () => void;
  incrementCardsCreated: () => void;
  upgradeToPro: () => void;
  downgradeToTrial: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  // For now, we'll start with trial. Later this will be managed by Stripe
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    tier: 'trial',
    limits: SUBSCRIPTION_LIMITS.trial,
    isActive: true,
    gamesPlayed: 0,
    cardsCreated: 0,
  });

  const isTrial = subscription.tier === 'trial';
  const isPro = subscription.tier === 'pro';

  // Check if user can play a specific game
  const canPlayGame = (gameType: string): boolean => {
    if (isPro) return true;
    
    // Check if game is available in trial tier
    const gameTier = GAME_TIERS[gameType];
    const isGameAvailable = gameTier === 'trial';
    
    // Check if user hasn't exceeded game limit
    const hasGameLimit = subscription.gamesPlayed < subscription.limits.maxGames;
    
    return isGameAvailable && hasGameLimit;
  };

  // Check if user can create a new card
  const canCreateCard = (): boolean => {
    if (isPro) return true;
    return subscription.cardsCreated < subscription.limits.maxCards;
  };

  // Increment games played
  const incrementGamesPlayed = () => {
    setSubscription(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  };

  // Increment cards created
  const incrementCardsCreated = () => {
    setSubscription(prev => ({
      ...prev,
      cardsCreated: prev.cardsCreated + 1,
    }));
  };

  // Upgrade to pro (placeholder for Stripe integration)
  const upgradeToPro = () => {
    setSubscription(prev => ({
      ...prev,
      tier: 'pro',
      limits: SUBSCRIPTION_LIMITS.pro,
    }));
  };

  // Downgrade to trial (for testing)
  const downgradeToTrial = () => {
    setSubscription(prev => ({
      ...prev,
      tier: 'trial',
      limits: SUBSCRIPTION_LIMITS.trial,
    }));
  };

  const value = {
    subscription,
    isTrial,
    isPro,
    canPlayGame,
    canCreateCard,
    incrementGamesPlayed,
    incrementCardsCreated,
    upgradeToPro,
    downgradeToTrial,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
