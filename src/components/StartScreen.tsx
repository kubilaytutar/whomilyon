import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameMode } from '@/context/GameModeContext';
import { Monitor, Smartphone } from 'lucide-react';

const StartScreen: React.FC = () => {
  const { setMode } = useGameMode();

  // Bu ekranda müzik çalma
  useEffect(() => {
    // audio.playStart();
    
    return () => {
      // audio.stopStart();
    };
  }, []);

  const handleModeSelect = (mode: 'desktop' | 'mobile') => {
    // Mod seçildiğinde müzik başlatma
    setMode(mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-white mb-4">
            🎯 Who Wants to Be a Millionaire?
          </CardTitle>
          <p className="text-blue-200 text-lg">
            Test your knowledge and climb the money ladder!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-white text-xl mb-4">Choose Your Experience</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Button 
              variant="outline" 
              size="lg"
              className="h-32 bg-white/10 border-white/30 hover:bg-white/20 text-white flex flex-col items-center justify-center gap-4"
              onClick={() => handleModeSelect('desktop')}
            >
              <Monitor size={48} />
              <div>
                <div className="font-semibold text-lg">Desktop Experience</div>
                <div className="text-sm text-blue-200">Full layout with prize ladder</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-32 bg-white/10 border-white/30 hover:bg-white/20 text-white flex flex-col items-center justify-center gap-4"
              onClick={() => handleModeSelect('mobile')}
            >
              <Smartphone size={48} />
              <div>
                <div className="font-semibold text-lg">Mobile Experience</div>
                <div className="text-sm text-blue-200">Optimized for mobile devices</div>
              </div>
            </Button>
          </div>
          
          <div className="text-center text-blue-200 text-sm mt-8">
            <p>Answer 15 questions correctly to win the grand prize!</p>
            <p>Use your lifelines wisely: 50:50, Ask the Audience, Phone a Friend</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartScreen; 