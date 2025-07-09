import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Trophy, Target, ChevronUp, ChevronDown } from 'lucide-react';

interface CompactPrizeLadderProps {
  currentLevel: number;
  isGameEnded: boolean;
  finalLevel?: number;
  prizes: number[];
}

const CompactPrizeLadder: React.FC<CompactPrizeLadderProps> = ({
  currentLevel,
  isGameEnded,
  finalLevel,
  prizes
}) => {
  const effectiveLevel = isGameEnded ? (finalLevel || currentLevel) : currentLevel;
  
  const prizeData = prizes.map((amount, index) => ({
    level: index + 1,
    amount: `$${amount.toLocaleString()}`,
  }));

  const getVisibleLevels = () => {
    const totalLevels = prizeData.length;
    let startLevel = Math.max(1, effectiveLevel - 2);
    let endLevel = Math.min(totalLevels, effectiveLevel + 2);

    if (endLevel - startLevel < 4) {
      if (startLevel === 1) {
        endLevel = Math.min(totalLevels, 5);
      } else {
        startLevel = Math.max(1, totalLevels - 4);
      }
    }
    
    return prizeData.slice(startLevel - 1, endLevel).reverse();
  };

  const visibleLevels = getVisibleLevels();

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

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-2">
                 <CardTitle className="text-white text-center text-sm flex items-center justify-center gap-2">
           <Trophy className="h-4 w-4" />
           Current Level
         </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-2">
         {effectiveLevel < prizeData.length && (
           <div className="text-center text-xs text-gray-300 flex items-center justify-center gap-1">
             <ChevronUp className="h-3 w-3" />
             <span>{prizeData.length - effectiveLevel} levels to go</span>
           </div>
         )}

        <div className="space-y-1">
          {visibleLevels.map((prize) => {
            const status = getPrizeStatus(prize.level);
            const isCurrent = status === 'current';

           return (
             <div
                key={prize.level}
               className={cn(
                  "flex items-center justify-between p-2 rounded text-sm transition-all duration-300",
                 isCurrent 
                    ? "bg-blue-600 text-white scale-105 font-bold shadow-lg ring-2 ring-blue-300"
                    : status === 'completed'
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
               )}
             >
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{prize.level}.</span>
                  {isCurrent && <Target className="h-3 w-3 animate-spin" />}
                </div>
                <span className={cn("font-semibold", isCurrent && "text-yellow-300")}>
                  {prize.amount}
                </span>
             </div>
           );
         })}
        </div>

         {effectiveLevel > 1 && (
           <div className="text-center text-xs text-gray-300 flex items-center justify-center gap-1">
             <ChevronDown className="h-3 w-3" />
             <span>{effectiveLevel - 1} levels completed</span>
           </div>
         )}

         <div className="mt-3 pt-2 border-t border-white/20">
           <div className="text-xs text-gray-300 text-center mb-1">
             Progress: {effectiveLevel}/{prizeData.length}
           </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(effectiveLevel / prizeData.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactPrizeLadder; 