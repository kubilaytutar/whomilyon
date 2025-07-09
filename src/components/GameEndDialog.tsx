import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, XCircle, RotateCcw, Home } from 'lucide-react';
import { PRIZE_LADDER } from '@/data/questions';

interface GameEndDialogProps {
  isOpen: boolean;
  isWinner: boolean;
  currentLevel: number;
  onPlayAgain: () => void;
  onBackToHome: () => void;
}

const GameEndDialog: React.FC<GameEndDialogProps> = ({
  isOpen,
  isWinner,
  currentLevel,
  onPlayAgain,
  onBackToHome
}) => {
  const getTitle = () => {
    return isWinner ? 'Congratulations! 🎉' : 'Game Over 😔';
  };

  const getMessage = () => {
    if (isWinner) {
      return 'You answered all questions correctly and won the grand prize!';
    } else {
      return 'Unfortunately, that was incorrect. Better luck next time!';
    }
  };

  const getFinalPrize = () => {
    if (isWinner) {
      // Tüm soruları doğru bildi, son ödülü ver
      return PRIZE_LADDER[PRIZE_LADDER.length - 1].amount;
    } else {
      // Yanlış bildi, safe haven kontrolü yap
      const questionIndex = currentLevel - 1;
      
      // Safe haven kontrolleri
      if (questionIndex >= 10) {
        // 10. sorudan sonra yanlış, 10. soru safe haven ($500,000)
        return PRIZE_LADDER[9].amount; // level 10 = index 9
      } else if (questionIndex >= 5) {
        // 5. sorudan sonra yanlış, 5. soru safe haven ($10,000)  
        return PRIZE_LADDER[4].amount; // level 5 = index 4
      } else {
        // İlk 5 soruda yanlış, ödül yok
        return '$0';
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onBackToHome}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            {isWinner ? (
              <Trophy className="h-8 w-8 text-yellow-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Result message */}
          <div className="text-center">
            <p className="text-lg mb-4">{getMessage()}</p>
            
            {/* Prize display */}
            <div className={`text-3xl font-bold p-4 rounded-lg ${
              isWinner ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {getFinalPrize()}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={onPlayAgain}
              size="lg"
              className="w-full flex items-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Play Again
            </Button>
            
            <Button
              onClick={onBackToHome}
              variant="outline"
              size="lg"
              className="w-full flex items-center gap-2"
            >
              <Home className="h-5 w-5" />
              Main Menu
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameEndDialog; 