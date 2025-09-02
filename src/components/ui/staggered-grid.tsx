import { ReactNode, useEffect, useState } from "react";
import { useSpring, animated, useTrail } from "@react-spring/web";

interface StaggeredGridProps {
  children: ReactNode[];
  className?: string;
  delay?: number;
}

export const StaggeredGrid = ({ children, className, delay = 0 }: StaggeredGridProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const trail = useTrail(children.length, {
    from: { opacity: 0, y: 20, scale: 0.9 },
    to: isVisible ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 },
    config: { tension: 300, friction: 30 }
  });

  return (
    <div className={className}>
      {trail.map((style, index) => (
        <animated.div key={index} style={style}>
          {children[index]}
        </animated.div>
      ))}
    </div>
  );
};
