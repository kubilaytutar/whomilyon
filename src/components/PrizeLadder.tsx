import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Trophy, Shield, Target } from 'lucide-react';

interface PrizeLadderProps {
  currentLevel: number;
  isGameEnded: boolean;
  finalLevel?: number;
  prizes: number[];
}

const PrizeLadder: React.FC<PrizeLadderProps> = ({ 
  currentLevel, 
  isGameEnded, 
  finalLevel,
  prizes 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLevelRef = useRef<HTMLDivElement>(null);
  const getPrizeStatus = (level: number): 'current' | 'completed' | 'upcoming' | 'failed' => {
    if (isGameEnded) {
      const endLevel = finalLevel || currentLevel;
      if (level <= endLevel) return 'completed';
      if (level === endLevel + 1) return 'failed';
      return 'upcoming';
    }
    
    if (level === currentLevel) return 'current';
    if (level < currentLevel) return 'completed';
    return 'upcoming';
  };

  const getPrizeClassName = (status: string, isSafeHaven: boolean) => {
    const baseClasses = "flex items-center justify-between p-3 rounded-lg transition-all duration-300 border";
    
    switch (status) {
      case 'current':
        return cn(baseClasses, "bg-blue-600 text-white border-blue-400 shadow-xl scale-110 ring-2 ring-blue-300 ring-opacity-50 animate-pulse");
      case 'completed':
        return cn(baseClasses, "bg-green-500 text-white border-green-400 shadow-md");
      case 'failed':
        return cn(baseClasses, "bg-red-500 text-white border-red-400 shadow-md");
      default:
        return cn(baseClasses, 
          isSafeHaven 
            ? "bg-amber-50 text-amber-800 border-amber-300 shadow-sm" 
            : "bg-gray-100 text-gray-600 border-gray-200"
        );
    }
  };

  // Mevcut seviyeye otomatik scroll
  useEffect(() => {
    if (currentLevelRef.current && containerRef.current && !isGameEnded) {
      const container = containerRef.current;
      const current = currentLevelRef.current;
      
      // Mevcut seviyeyi container'ın ortasında göster
      const containerHeight = container.clientHeight;
      const currentTop = current.offsetTop;
      const currentHeight = current.clientHeight;
      
      const scrollTo = currentTop - (containerHeight / 2) + (currentHeight / 2);
      
      container.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      });
    }
  }, [currentLevel, isGameEnded]);

  // Ters sırada göster (en yüksek ödül üstte)
  const reversedPrizes = [...prizes].reverse();

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-center flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5" />
          Prize Ladder
        </CardTitle>
      </CardHeader>
      <CardContent 
        ref={containerRef}
        className="space-y-2 max-h-96 overflow-y-auto scroll-smooth"
      >
        {reversedPrizes.map((amount, index) => {
          const level = prizes.length - index;
          const status = getPrizeStatus(level);
          const isCurrent = status === 'current';
          const isSafeHaven = level === 5 || level === 10;

          return (
            <div
              key={level}
              ref={isCurrent ? currentLevelRef : null}
              className={getPrizeClassName(status, isSafeHaven)}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {level}.
                </span>
                {isCurrent && (
                  <Target className="h-4 w-4 text-white animate-spin" />
                )}
                {isSafeHaven && (
                  <Shield className={cn("h-4 w-4", 
                    isCurrent ? "text-yellow-300" : "text-amber-500"
                  )} />
                )}
              </div>
              
              <div className="font-bold">
                ${amount.toLocaleString()}
              </div>
            </div>
          );
        })}
        
        {/* Baraj noktaları açıklaması */}
        <div className="mt-4 pt-3 border-t border-white/20">
          <div className="text-xs text-gray-300 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="h-3 w-3 text-amber-500" />
              <span>Güvenli Noktalar</span>
            </div>
            <p>5. ve 10. sorular baraj noktalarıdır</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrizeLadder; 