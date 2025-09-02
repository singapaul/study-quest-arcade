import { ReactNode } from "react";
import { useSpring, animated } from "@react-spring/web";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  const [fadeProps] = useSpring(() => ({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 30 }
  }));

  return (
    <animated.div style={fadeProps} className={className}>
      {children}
    </animated.div>
  );
};
