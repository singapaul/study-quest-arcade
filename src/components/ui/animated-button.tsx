import { ReactNode } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  children: ReactNode;
  className?: string;
  bounceOnClick?: boolean;
}

export const AnimatedButton = ({ 
  children, 
  className, 
  bounceOnClick = true,
  onClick,
  ...props 
}: AnimatedButtonProps) => {
  const [springProps, setSpringProps] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 20 }
  }));

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (bounceOnClick) {
      setSpringProps({ scale: 0.95 });
      setTimeout(() => setSpringProps({ scale: 1 }), 150);
    }
    onClick?.(e);
  };

  return (
    <animated.div style={springProps}>
      <Button
        {...props}
        onClick={handleClick}
        className={cn(className)}
      >
        {children}
      </Button>
    </animated.div>
  );
};
