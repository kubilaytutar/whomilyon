import { useRef, useCallback, useEffect, useState } from 'react';

export interface AudioManager {
  playStart: () => void;
  stopStart: () => void;
  playBackground: () => void;
  stopBackground: () => void;
  playTension: () => void;
  stopTension: () => void;
  playCorrect: (onEnded?: () => void) => void;
  playWrong: () => void;
  playStar: (options?: { onPlay?: () => void; onEnded?: () => void }) => void;
  playJoker: () => void;
  playJokerEnd: () => void;
  stopAll: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

// Basit audio çalma fonksiyonu
const playAudio = (src: string, volume: number = 0.5, loop: boolean = false): HTMLAudioElement | null => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    audio.play();
    return audio;
  } catch (error) {
    console.log(`Could not play: ${src}`);
    return null;
  }
};

// Callback ile audio çalma
const playAudioWithCallback = (
  src: string, 
  volume: number = 0.5, 
  loop: boolean = false, 
  callbacks?: { onPlay?: () => void; onEnded?: () => void }
): HTMLAudioElement | null => {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    
    if (callbacks?.onPlay) {
      audio.addEventListener('play', callbacks.onPlay);
    }
    if (callbacks?.onEnded) {
      audio.addEventListener('ended', callbacks.onEnded);
    }
    
    audio.play();
    return audio;
  } catch (error) {
    console.log(`Could not play: ${src}`);
    if (callbacks?.onEnded) setTimeout(callbacks.onEnded, 1000); // Fallback timing
    return null;
  }
};

export const useAudio = (): AudioManager => {
  const startRef = useRef<HTMLAudioElement | null>(null);
  const backgroundRef = useRef<HTMLAudioElement | null>(null);
  const tensionRef = useRef<HTMLAudioElement | null>(null);
  
  // Ses durumu - default AÇIK
  const [isMuted, setIsMuted] = useState(false);

  // Cleanup
  useEffect(() => {
    return () => {
      if (startRef.current) startRef.current.pause();
      if (backgroundRef.current) backgroundRef.current.pause();
      if (tensionRef.current) tensionRef.current.pause();
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      localStorage.setItem('gameAudioMuted', newMuted.toString());
      
      if (newMuted) {
        // Tüm sesleri durdur
        if (startRef.current) startRef.current.pause();
        if (backgroundRef.current) backgroundRef.current.pause();
        if (tensionRef.current) tensionRef.current.pause();
      }
      
      return newMuted;
    });
  }, []);

  const playStart = useCallback(() => {
    if (isMuted) return;
    
    if (startRef.current) {
      startRef.current.pause();
    }
    
    const audio = playAudio('/sounds/start.mp3', 0.5, true);
    if (audio) {
      startRef.current = audio;
    }
  }, [isMuted]);

  const stopStart = useCallback(() => {
    if (startRef.current) {
      startRef.current.pause();
      startRef.current = null;
    }
  }, []);

  const playBackground = useCallback(() => {
    if (isMuted) return;
    
    if (backgroundRef.current) {
      backgroundRef.current.pause();
    }
    
    const audio = playAudio('/sounds/background.mp3', 0.3, true);
    if (audio) {
      backgroundRef.current = audio;
    }
  }, [isMuted]);

  const stopBackground = useCallback(() => {
    if (backgroundRef.current) {
      backgroundRef.current.pause();
      backgroundRef.current = null;
    }
  }, []);

  const playTension = useCallback(() => {
    if (isMuted) return;
    
    if (tensionRef.current) {
      tensionRef.current.pause();
    }
    
    const audio = playAudio('/sounds/tension.mp3', 0.4);
    if (audio) {
      tensionRef.current = audio;
      // 7 saniye sonra durdur
      setTimeout(() => {
        if (tensionRef.current === audio) {
          tensionRef.current.pause();
          tensionRef.current = null;
        }
      }, 7000);
    }
  }, [isMuted]);

  const stopTension = useCallback(() => {
    if (tensionRef.current) {
      tensionRef.current.pause();
      tensionRef.current = null;
    }
  }, []);

  const playCorrect = useCallback((onEnded?: () => void) => {
    if (isMuted) {
      if (onEnded) setTimeout(onEnded, 500); // Muted ise callback'i hemen çalıştır
      return;
    }
    playAudioWithCallback('/sounds/correct.mp3', 0.7, false, { onEnded });
  }, [isMuted]);

  const playWrong = useCallback(() => {
    if (isMuted) return;
    playAudio('/sounds/wrong.mp3', 0.7);
  }, [isMuted]);

  const playStar = useCallback((options?: { onPlay?: () => void; onEnded?: () => void }) => {
    if (isMuted) {
      if (options?.onPlay) setTimeout(options.onPlay, 500);
      if (options?.onEnded) setTimeout(options.onEnded, 1500); // Muted ise callback'leri hemen çalıştır
      return;
    }
    playAudioWithCallback('/sounds/star.mp3', 0.6, false, options);
  }, [isMuted]);

  const playJoker = useCallback(() => {
    if (isMuted) return;
    playAudio('/sounds/joker.mp3', 0.6);
  }, [isMuted]);

  const playJokerEnd = useCallback(() => {
    if (isMuted) return;
    playAudio('/sounds/jokerend.mp3', 0.6);
  }, [isMuted]);

  const stopAll = useCallback(() => {
    if (startRef.current) startRef.current.pause();
    if (backgroundRef.current) backgroundRef.current.pause();
    if (tensionRef.current) tensionRef.current.pause();
  }, []);

  return {
    playStart,
    stopStart,
    playBackground,
    stopBackground,
    playTension,
    stopTension,
    playCorrect,
    playWrong,
    playStar,
    playJoker,
    playJokerEnd,
    stopAll,
    toggleMute,
    isMuted
  };
}; 