import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGameMode } from '@/context/GameModeContext';
import { useAudio } from '@/hooks/useAudio';
import { QUESTIONS, Question } from '@/data/questions';
import CompactPrizeLadder from '@/components/CompactPrizeLadder';
import GameEndDialog from '@/components/GameEndDialog';
import Confetti from 'react-confetti';
import { ArrowLeft, Phone, Users, Percent, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import HorizontalPrizeLadder from './HorizontalPrizeLadder';

interface LifelineUsage {
  fiftyFifty: boolean;
  askAudience: boolean;
  phoneAFriend: boolean;
}

// Ödül miktarları
const PRIZE_AMOUNTS = [
  100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000,
  250000, 500000, 1000000,
];

const GameScreen: React.FC = () => {
  const { mode, setMode } = useGameMode();
  const audio = useAudio();
  
  // Oyun durumu
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  // Yeni state'ler
  const [isCorrectCelebrating, setIsCorrectCelebrating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinnings, setShowWinnings] = useState(false);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  
  // Jokerler
  const [lifelinesUsed, setLifelinesUsed] = useState<LifelineUsage>({
    fiftyFifty: false,
    askAudience: false,
    phoneAFriend: false
  });
  const [visibleOptions, setVisibleOptions] = useState<string[]>([]);
  const [audienceDialog, setAudienceDialog] = useState(false);
  const [phoneDialog, setPhoneDialog] = useState(false);
  const [audienceResults, setAudienceResults] = useState<{ [key: string]: number }>({});

  // Mevcut soru
  const currentQuestion = gameQuestions[currentQuestionIndex];

  // Component mount olduğunda oyunu başlat
  useEffect(() => {
    resetGame();
    
    return () => {
      audio.stopAll();
    };
  }, []);

  // Mode değiştiğinde müziği durdur
  useEffect(() => {
    return () => {
      if (!mode) {
        audio.stopAll();
      }
    };
  }, [mode]);

  // Soru değiştiğinde seçenekleri resetle
  useEffect(() => {
    resetCurrentQuestion();
  }, [currentQuestionIndex, gameQuestions]);

  const resetCurrentQuestion = () => {
    if (currentQuestion) {
      setVisibleOptions(currentQuestion.options);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsWaiting(false);
      setIsCorrectCelebrating(false);
      setShowConfetti(false);
      setShowWinnings(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || showResult || isWaiting || gameEnded) return;
    
    setSelectedAnswer(answer);
    setIsWaiting(true);
    
    // Arka plan müziğini durdur ve tension müziğini başlat (7 saniye)
    audio.stopBackground();
    audio.playTension();
    
    // 7 saniye bekle sonra sonucu göster
    setTimeout(() => {
      const correct = answer === currentQuestion.correctAnswer;
      setShowResult(true);
      setIsWaiting(false);
      
      // Sonuca göre ses çal
      if (correct) {
        // Doğru cevap yeşil yanıp sönmeye başlasın
        setIsCorrectCelebrating(true);
        
        // Correct sesi çal ve bitince callback ile star çal
        audio.playCorrect(() => {
          if (currentQuestionIndex === gameQuestions.length - 1) {
            // Son soruyu doğru bildi, oyunu kazandı
            setGameWon(true);
            setGameEnded(true);
          } else {
            // Star müziği başladığında konfeti patlasın, kazancı göster ve sıradaki soruya geç
            setIsCorrectCelebrating(false); // Yeşil animasyonu durdur
            
            // Star sesini çal, başlarken ve biterken olayları yönet
            audio.playStar({
              onPlay: () => {
                setShowConfetti(true);
                setCurrentWinnings(PRIZE_AMOUNTS[currentQuestionIndex]);
                setShowWinnings(true);
              },
              onEnded: () => {
                setShowConfetti(false);
                setShowWinnings(false);
                setCurrentQuestionIndex(prev => prev + 1);
                audio.playBackground();
              }
            });
          }
        });
      } else {
        audio.playWrong();
        
        // Yanlış cevap ise 2 saniye bekleyip oyunu bitir
        setTimeout(() => {
          setGameEnded(true);
          setGameWon(false);
        }, 2000);
      }
    }, 7000); // 7 saniye tension müziği
  };

  const resetGame = () => {
    // Soruları her yeni oyunda karıştır
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setGameQuestions(shuffled);

    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsWaiting(false);
    setGameEnded(false);
    setGameWon(false);
    setIsCorrectCelebrating(false);
    setShowConfetti(false);
    setShowWinnings(false);
    setCurrentWinnings(0);
    setLifelinesUsed({
      fiftyFifty: false,
      askAudience: false,
      phoneAFriend: false
    });
    setAudienceResults({});
    
    // Arka plan müziğini yeniden başlat
    audio.playBackground();
  };

  const handleBackToHome = () => {
    resetGame();
    setMode(null);
  };



  const handleFiftyFifty = () => {
    if (lifelinesUsed.fiftyFifty || isWaiting || showResult || gameEnded) return;
    
    audio.stopBackground();
    // Joker sesi çal
    audio.playJoker();
    
    // Joker seçim yapma simülasyonu için kısa bekleme
    setTimeout(() => {
      audio.playJokerEnd();
      
      const correctAnswer = currentQuestion.correctAnswer;
      const incorrectOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
      const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
      
      setVisibleOptions([correctAnswer, randomIncorrect].sort(() => Math.random() - 0.5));
      setLifelinesUsed(prev => ({ ...prev, fiftyFifty: true }));
    }, 1500); // Joker sesi süresi
  };

  const handleAskAudience = () => {
    if (lifelinesUsed.askAudience || isWaiting || showResult || gameEnded) return;
    
    audio.stopBackground();
    // Joker sesi çal
    audio.playJoker();
    
    // Joker seçim yapma simülasyonu
    setTimeout(() => {
      audio.playJokerEnd();
      
      // Rastgele yüzde dağılımı oluştur
      const results: { [key: string]: number } = {};
      const correctAnswer = currentQuestion.correctAnswer;
      
      visibleOptions.forEach(option => {
        if (option === correctAnswer) {
          results[option] = Math.floor(Math.random() * 30) + 40; // 40-70% arası
        } else {
          results[option] = Math.floor(Math.random() * 20) + 5; // 5-25% arası
        }
      });
      
      // Toplamı 100 yap
      const total = Object.values(results).reduce((sum, val) => sum + val, 0);
      Object.keys(results).forEach(key => {
        results[key] = Math.round((results[key] / total) * 100);
      });
      
      setAudienceResults(results);
      setAudienceDialog(true);
      setLifelinesUsed(prev => ({ ...prev, askAudience: true }));
    }, 1500);
  };

  const handlePhoneAFriend = () => {
    if (lifelinesUsed.phoneAFriend || isWaiting || showResult || gameEnded) return;
    
    audio.stopBackground();
    // Joker sesi çal
    audio.playJoker();
    
    // Joker seçim yapma simülasyonu
    setTimeout(() => {
      audio.playJokerEnd();
      
      setPhoneDialog(true);
      setLifelinesUsed(prev => ({ ...prev, phoneAFriend: true }));
    }, 1500);
  };

  const getButtonVariant = (option: string) => {
    // Bekleme durumunda seçilen seçenek sarı
    if (isWaiting && option === selectedAnswer) return "pending";
    
    // Sonuç gösterildiğinde
    if (showResult) {
      if (option === currentQuestion.correctAnswer) return "success";
      if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return "danger";
    }
    
    // Mobil için outline, desktop için özel answer stili
    return mode === 'desktop' ? 'answer' : 'outline';
  };

  const getButtonClassName = (option: string) => {
    // Tension süresince seçilen şık için özel animasyon
    if (isWaiting && option === selectedAnswer) {
      return "tension-waiting";
    }
    
    // Correct müziği çalarken doğru cevap için yeşil yanıp sönme
    if (isCorrectCelebrating && option === currentQuestion.correctAnswer) {
      return "correct-celebrating";
    }
    
    return "";
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  if (mode === 'mobile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        {/* Konfeti Efekti */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}
        
        {/* Kazanç Gösterimi */}
        {showWinnings && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="winnings-display flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 rounded-full text-4xl font-bold shadow-2xl border-4 border-yellow-300">
              <span>${currentWinnings.toLocaleString()}</span>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setMode(null)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            {/* Ses Toggle Butonu */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={audio.toggleMute}
              className="text-white hover:bg-white/10"
            >
              {audio.isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetGame}
              className="text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
        </div>

        {/* Question Info */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="text-center mb-2">
              <span className="text-blue-300 text-sm font-semibold">
                QUESTION {currentQuestionIndex + 1} (of {gameQuestions.length})
              </span>
            </div>
            <CardTitle className="text-white text-lg text-center">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Answer Options */}
        <div className="space-y-3 mb-6">
          {visibleOptions.map((option) => (
            <Button
              key={option}
              variant={getButtonVariant(option)}
              size="lg"
              className={`w-full h-16 text-left justify-start text-wrap p-4 ${getButtonClassName(option)}`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showResult || isWaiting || gameEnded}
             >
               <span className="font-semibold mr-3">{String.fromCharCode(65 + currentQuestion.options.indexOf(option))})</span>
              {option}
            </Button>
          ))}
        </div>

        {/* Lifelines */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={lifelinesUsed.fiftyFifty ? "secondary" : "outline"}
                size="sm"
                onClick={handleFiftyFifty}
                disabled={lifelinesUsed.fiftyFifty || showResult || isWaiting}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Percent className="h-6 w-6 mb-1" />
                <span className="text-xs">50:50</span>
              </Button>
              <Button
                variant={lifelinesUsed.askAudience ? "secondary" : "outline"}
                size="sm"
                onClick={handleAskAudience}
                disabled={lifelinesUsed.askAudience || showResult || isWaiting}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Users className="h-6 w-6 mb-1" />
                <span className="text-xs">Audience</span>
              </Button>
              <Button
                variant={lifelinesUsed.phoneAFriend ? "secondary" : "outline"}
                size="sm"
                onClick={handlePhoneAFriend}
                disabled={lifelinesUsed.phoneAFriend || showResult || isWaiting}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Phone className="h-6 w-6 mb-1" />
                <span className="text-xs">Phone</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prize Ladder - Compact view for mobile */}
        <div className="mt-6">
          <CompactPrizeLadder 
            currentLevel={currentQuestionIndex + 1}
            isGameEnded={gameEnded}
            finalLevel={gameEnded ? currentQuestionIndex + (gameWon ? 1 : 0) : undefined}
            prizes={PRIZE_AMOUNTS}
          />
        </div>

        {/* Game End Dialog */}
        <GameEndDialog
          isOpen={gameEnded}
          isWinner={gameWon}
          currentLevel={currentQuestionIndex + (gameWon ? 1 : 0)}
          onPlayAgain={resetGame}
          onBackToHome={handleBackToHome}
        />

        {/* Dialogs */}
        <Dialog open={audienceDialog} onOpenChange={setAudienceDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Audience Poll</DialogTitle>
              <DialogDescription>
                The audience votes are:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {Object.entries(audienceResults).map(([option, percentage]) => (
                <div key={option} className="flex justify-between items-center">
                  <span>{option}</span>
                  <span className="font-bold">%{percentage}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={phoneDialog} onOpenChange={setPhoneDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Phone a Friend</DialogTitle>
                          <DialogDescription>
              Your friend says: "I think the answer should be <strong>{currentQuestion.correctAnswer}</strong>. I'm quite confident!"
            </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="desktop-game-screen min-h-screen bg-black text-white p-6 font-sans flex flex-col relative">
      {/* Konfeti Efekti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
        />
      )}
      
      {/* Kazanç Gösterimi */}
      {showWinnings && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="winnings-display flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-12 py-6 rounded-full text-4xl font-bold shadow-2xl border-4 border-yellow-300">
            <span>${currentWinnings.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Üst Kontrol Butonları */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={audio.toggleMute}
          className="text-white/70 hover:text-white hover:bg-white/10"
          title="Toggle Sound"
        >
          {audio.isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetGame}
          className="text-white/70 hover:text-white hover:bg-white/10"
          title="Restart Game"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMode(null)}
          className="text-white/70 hover:text-white hover:bg-white/10"
          title="Back to Menu"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Ana Oyun Alanı (Üst Kısım) */}
      <div className="flex-grow flex items-center">
        <div className="w-full">
          {/* Orta Sütun: Ana Oyun Alanı */}
          <div className="relative flex flex-col items-center justify-center h-full">
            {/* Jokerler */}
            <div className="flex gap-10 my-12">
              <Button
                onClick={handleFiftyFifty}
                disabled={lifelinesUsed.fiftyFifty || showResult || isWaiting}
                className="lifeline-button"
              >
                50:50
              </Button>
              <Button
                onClick={handlePhoneAFriend}
                disabled={lifelinesUsed.phoneAFriend || showResult || isWaiting}
                className="lifeline-button"
              >
                <Phone className="h-10 w-10" />
              </Button>
              <Button
                onClick={handleAskAudience}
                disabled={lifelinesUsed.askAudience || showResult || isWaiting}
                className="lifeline-button"
              >
                <Users className="h-10 w-10" />
              </Button>
            </div>

            {/* Soru */}
            <div className="question-box w-full max-w-4xl mb-10">
              Soru {currentQuestionIndex + 1}: {currentQuestion.question}
            </div>

            {/* Cevap Seçenekleri */}
            <div className="w-full max-w-5xl grid grid-cols-2 gap-x-8 gap-y-5">
              {visibleOptions.map((option) => (
                <div className="answer-box-wrapper" key={option}>
                    <Button
                      variant={getButtonVariant(option)}
                      size="lg"
                      className={`answer-box ${getButtonClassName(option)}`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult || isWaiting || gameEnded}
                    >
                      <span className="answer-letter">{String.fromCharCode(65 + currentQuestion.options.indexOf(option))}:</span>
                      <span className="answer-text">{option}</span>
                    </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Yatay Ödül Listesi */}
      <footer className="w-full mt-auto pt-4">
        <HorizontalPrizeLadder currentLevel={currentQuestionIndex + 1} />
      </footer>

      {/* Game End Dialog */}
      <GameEndDialog
        isOpen={gameEnded}
        isWinner={gameWon}
        currentLevel={currentQuestionIndex + (gameWon ? 1 : 0)}
        onPlayAgain={resetGame}
        onBackToHome={handleBackToHome}
      />

      {/* Dialogs */}
      <Dialog open={audienceDialog} onOpenChange={setAudienceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audience Poll</DialogTitle>
            <DialogDescription>
              The audience votes are:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {Object.entries(audienceResults).map(([option, percentage]) => (
              <div key={option} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span className="font-medium">{option}</span>
                <span className="font-bold text-lg">%{percentage}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={phoneDialog} onOpenChange={setPhoneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phone a Friend</DialogTitle>
                        <DialogDescription className="text-base">
            Your friend says: "I think the answer should be <strong>{currentQuestion.correctAnswer}</strong>. I'm quite confident about this!"
          </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameScreen; 