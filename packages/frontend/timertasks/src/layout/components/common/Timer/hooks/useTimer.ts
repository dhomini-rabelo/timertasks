import { useEffect, useRef, useState } from 'react';

interface UserTimerProps {
  initialMinutes: number;
}

interface TimerState {
  currentTimeInSeconds: number;
  isRunning: boolean;
}

export function useTimer(
  { initialMinutes }: UserTimerProps
) {
  const initialTimeInSeconds = initialMinutes * 60;
  const [state, setState] = useState<TimerState>({
    currentTimeInSeconds: initialTimeInSeconds,
    isRunning: false,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  function start() {
    if (intervalRef.current) return;
    if (state.currentTimeInSeconds <= 0) return;

    setState((prev) => ({ ...prev, isRunning: true }));

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.currentTimeInSeconds <= 0) {
          stop()
          return { ...prev, isRunning: false, currentTimeInSeconds: 0 };
        }

        console.log(prev.currentTimeInSeconds - 1);
        return {
          ...prev,
          currentTimeInSeconds: prev.currentTimeInSeconds - 1,
        }
      });
    }, 1000);
  }

  function stop() {
    if (!state.isRunning) return;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setState((prev) => ({ ...prev, isRunning: false }));
  }

  function reset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setState({
      currentTimeInSeconds: initialTimeInSeconds,
      isRunning: false,
    });
  }

  return {
    actions: {
      start,
      stop,
      reset,
    },
    state: {
      currentTimeInSeconds: state.currentTimeInSeconds,
      isRunning: state.isRunning,
    },
  };
}
