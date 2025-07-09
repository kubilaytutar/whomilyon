import React, { createContext, useContext, useState, ReactNode } from 'react';

export type GameMode = 'mobile' | 'desktop';

interface GameModeContextType {
  mode: GameMode | null;
  setMode: (mode: GameMode | null) => void;
}

const GameModeContext = createContext<GameModeContextType | undefined>(undefined);

export const useGameMode = () => {
  const context = useContext(GameModeContext);
  if (context === undefined) {
    throw new Error('useGameMode must be used within a GameModeProvider');
  }
  return context;
};

interface GameModeProviderProps {
  children: ReactNode;
}

export const GameModeProvider: React.FC<GameModeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<GameMode | null>(null);

  return (
    <GameModeContext.Provider value={{ mode, setMode }}>
      {children}
    </GameModeContext.Provider>
  );
}; 