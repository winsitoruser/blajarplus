import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';

export function useSoundAlert() {
  const audioRef = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Preload sounds
    audioRef.current = {
      notification: new Audio('/sounds/notification.mp3'),
      message: new Audio('/sounds/message.mp3'),
      success: new Audio('/sounds/success.mp3'),
      alert: new Audio('/sounds/alert.mp3'),
    };

    // Set volume
    Object.values(audioRef.current).forEach(audio => {
      audio.volume = 0.5;
    });

    // Check user preferences
    checkSoundPreference();
  }, []);

  const checkSoundPreference = async () => {
    try {
      const response = await api.get('/notifications/preferences');
      setSoundEnabled(response.data.soundAlerts !== false);
    } catch (error) {
      console.error('Error checking sound preference:', error);
    }
  };

  const playSound = async (type: string = 'notification') => {
    if (!soundEnabled) return;

    try {
      const audio = audioRef.current[type];
      if (audio) {
        audio.currentTime = 0;
        await audio.play().catch(err => {
          // Autoplay might be blocked by browser
          console.warn('Sound autoplay blocked:', err);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return { playSound, soundEnabled, toggleSound };
}
