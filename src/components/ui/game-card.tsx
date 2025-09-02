import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { GAME_TIERS } from "@/types/subscription";
import { useSpring, animated } from "@react-spring/web";

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  difficulty?: "easy" | "medium" | "hard";
  className?: string;
  gameType?: string;
}

export const GameCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  difficulty = "medium",
  className,
  gameType
}: GameCardProps) => {
  const { canPlayGame, isTrial } = useSubscription();
  
  const isGameLocked = gameType && !canPlayGame(gameType);
  const isProGame = gameType && GAME_TIERS[gameType] === 'pro';
  
  const difficultyColors = {
    easy: "border-success/20 bg-success/5",
    medium: "border-warning/20 bg-warning/5", 
    hard: "border-destructive/20 bg-destructive/5"
  };

  // Spring animations
  const [hoverProps, setHoverProps] = useSpring(() => ({
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    config: { tension: 300, friction: 30 }
  }));

  const [iconProps, setIconProps] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    config: { tension: 400, friction: 25 }
  }));

  return (
    <animated.div
      style={hoverProps}
      onClick={isGameLocked ? undefined : onClick}
      onMouseEnter={() => {
        if (!isGameLocked) {
          setHoverProps({
            scale: 1.02,
            y: -4,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)'
          });
          setIconProps({ scale: 1.1, rotate: 5 });
        }
      }}
      onMouseLeave={() => {
        setHoverProps({
          scale: 1,
          y: 0,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        });
        setIconProps({ scale: 1, rotate: 0 });
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 bg-card p-6",
        difficultyColors[difficulty],
        isGameLocked 
          ? "opacity-60 cursor-not-allowed" 
          : "cursor-pointer hover:border-primary/30 hover:bg-primary/5",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <animated.div 
          style={iconProps}
          className="rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
        >
          {icon}
        </animated.div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {difficulty.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Pro tag for locked games */}
      {isProGame && isTrial && (
        <div className="absolute top-3 right-3 z-20">
          <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg">
            PRO
          </span>
        </div>
      )}

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      

    </animated.div>
  );
};