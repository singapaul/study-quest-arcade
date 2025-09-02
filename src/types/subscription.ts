export type SubscriptionTier = 'trial' | 'pro';

export interface SubscriptionLimits {
  maxGames: number;
  maxCards: number;
  canAccessAllGames: boolean;
  canCreateUnlimitedCards: boolean;
}

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  limits: SubscriptionLimits;
  isActive: boolean;
  expiresAt?: Date;
  gamesPlayed: number;
  cardsCreated: number;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  trial: {
    maxGames: 5,
    maxCards: 10,
    canAccessAllGames: false,
    canCreateUnlimitedCards: false,
  },
  pro: {
    maxGames: Infinity,
    maxCards: Infinity,
    canAccessAllGames: true,
    canCreateUnlimitedCards: true,
  },
};

export const GAME_TIERS: Record<string, SubscriptionTier> = {
  // Basic games available in trial
  flashcards: 'trial',
  quiz: 'trial',
  truefalse: 'trial',
  typeanswer: 'trial',
  hintmaster: 'trial',
  
  // Advanced games require pro
  memory: 'pro',
  scramble: 'pro',
  speedround: 'pro',
  fillblanks: 'pro',
  reversequiz: 'pro',
  sequencematch: 'pro',
  categorysort: 'pro',
  splat: 'pro',
  swipe: 'pro',
};
