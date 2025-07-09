import React from 'react';
import { GameModeProvider, useGameMode } from './context/GameModeContext';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import './globals.css';

const AppContent: React.FC = () => {
  const { mode } = useGameMode();

  if (!mode) {
    return <StartScreen />;
  }

  return <GameScreen />;
};

const App: React.FC = () => {
  return (
    <GameModeProvider>
      <AppContent />
    </GameModeProvider>
  );
};

export default App; 