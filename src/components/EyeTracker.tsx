import { useEffect, useRef, useState } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface EyePosition {
  x: number;
  y: number;
}

const EyeTracker = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateEyePosition = (eyeRef: React.RefObject<HTMLDivElement>): EyePosition => {
    if (!eyeRef.current) return { x: 0, y: 0 };

    const eyeRect = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eyeRect.left + eyeRect.width / 2;
    const eyeCenterY = eyeRect.top + eyeRect.height / 2;

    const deltaX = mousePosition.x - eyeCenterX;
    const deltaY = mousePosition.y - eyeCenterY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 25; // Maximum pupil movement in pixels
    
    const moveX = distance > 0 ? (deltaX / distance) * Math.min(distance, maxDistance) : 0;
    const moveY = distance > 0 ? (deltaY / distance) * Math.min(distance, maxDistance) : 0;

    return { x: moveX, y: moveY };
  };

  const leftEyePosition = calculateEyePosition(leftEyeRef);
  const rightEyePosition = calculateEyePosition(rightEyeRef);

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-8">
      <div className="flex gap-16 md:gap-24">
        {/* Left Eye */}
        <div className="relative">
          <div 
            ref={leftEyeRef}
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-eye rounded-full shadow-2xl border-4 border-eye-shadow relative overflow-hidden"
            style={{
              boxShadow: '0 0 40px hsl(var(--eye-glow) / 0.3), inset 0 0 20px hsl(var(--eye-shadow) / 0.2)'
            }}
          >
            {/* Iris */}
            <div 
              className="absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-iris rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-eye"
              style={{
                transform: `translate(calc(-50% + ${leftEyePosition.x}px), calc(-50% + ${leftEyePosition.y}px))`,
                background: 'radial-gradient(circle, hsl(var(--iris-blue)) 0%, hsl(210 90% 45%) 70%, hsl(220 60% 30%) 100%)'
              }}
            >
              {/* Pupil */}
              <div 
                className="absolute w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-pupil rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-eye"
                style={{
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)'
                }}
              >
                {/* Light reflection */}
                <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white rounded-full top-1 left-1 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Eye */}
        <div className="relative">
          <div 
            ref={rightEyeRef}
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-eye rounded-full shadow-2xl border-4 border-eye-shadow relative overflow-hidden"
            style={{
              boxShadow: '0 0 40px hsl(var(--eye-glow) / 0.3), inset 0 0 20px hsl(var(--eye-shadow) / 0.2)'
            }}
          >
            {/* Iris */}
            <div 
              className="absolute w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-iris rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-eye"
              style={{
                transform: `translate(calc(-50% + ${rightEyePosition.x}px), calc(-50% + ${rightEyePosition.y}px))`,
                background: 'radial-gradient(circle, hsl(var(--iris-green)) 0%, hsl(120 70% 40%) 70%, hsl(140 50% 25%) 100%)'
              }}
            >
              {/* Pupil */}
              <div 
                className="absolute w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-pupil rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-eye"
                style={{
                  boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)'
                }}
              >
                {/* Light reflection */}
                <div className="absolute w-2 h-2 md:w-3 md:h-3 bg-white rounded-full top-1 left-1 opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-4">
          👀 Gaze Following Eyes
        </h1>
        <p className="text-muted-foreground text-center text-lg">
          Move your mouse around to see the eyes follow your cursor!
        </p>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-accent rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-iris-purple rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default EyeTracker;