import { differenceInMilliseconds, subSeconds } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

interface TimerState {
  currentTimeInSeconds: number;
  isRunning: boolean;
}

interface UseCountUpTimerOptions {
  initialSeconds?: number;
  autoStart?: boolean;
}

export function useCountUpTimer({
  initialSeconds = 0,
  autoStart = false,
}: UseCountUpTimerOptions = {}) {
  const [state, setState] = useState<TimerState>({
    currentTimeInSeconds: initialSeconds,
    isRunning: autoStart,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  function start() {
    if (intervalRef.current) return;
    
    // Set start time to now minus the time already elapsed
    // This allows pausing and resuming without losing track of time
    startTimeRef.current = subSeconds(new Date(), state.currentTimeInSeconds);

    setState((prev) => ({ ...prev, isRunning: true }));

    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const now = new Date();
      
      const millisecondsPassed = differenceInMilliseconds(now, startTimeRef.current);

      setState((prev) => ({
        ...prev,
        currentTimeInSeconds: Math.floor(millisecondsPassed / 1000),
      }));
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
      currentTimeInSeconds: 0,
      isRunning: false,
    });
  }

  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);


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
