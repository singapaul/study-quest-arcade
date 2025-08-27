import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
  difficulty?: "easy" | "medium" | "hard";
  className?: string;
}

export const GameCard = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  difficulty = "medium",
  className 
}: GameCardProps) => {
  const difficultyColors = {
    easy: "border-success/20 bg-success/5",
    medium: "border-warning/20 bg-warning/5", 
    hard: "border-destructive/20 bg-destructive/5"
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border-2 bg-card p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        difficultyColors[difficulty],
        "hover:border-primary/30 hover:bg-primary/5",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          {icon}
        </div>
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
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
};