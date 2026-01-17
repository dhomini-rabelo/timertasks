import { addSeconds, differenceInMilliseconds } from "date-fns";
import { create } from "zustand";

interface CountdownTimerState {
  activityMinutes: number;
  initialMinutes: number;
  restMinutes: number;
  currentTimeInSeconds: number;
  isRunning: boolean;
  totalCycles: number;
  isResting: boolean;
}

interface CountdownTimerActions {
  start: () => void;
  stop: () => void;
  reset: () => void;
  updateActivityMinutes: (activityMinutes: number) => void;
}

interface CountdownTimerStore {
  state: CountdownTimerState;
  actions: CountdownTimerActions;
}

const secondsPerMinute = 60;
const millisecondsPerSecond = 1000;
const initialActivityMinutes = 25;

function getRestMinutes(activityMinutes: number) {
  return activityMinutes * 0.2;
}

const initialRestMinutes = getRestMinutes(initialActivityMinutes);

const intervalRef: { current: ReturnType<typeof setInterval> | null } = {
  current: null,
};
const endTimeRef: { current: Date | null } = { current: null };

function playAlertSound() {
  const alarmAudio = new Audio("/car-alarm.mp3");
  const restartPositionInSeconds = 0;
  alarmAudio.currentTime = restartPositionInSeconds;
  alarmAudio
    .play()
    .catch(() => {})
    .then(() => {
      new Notification("Timer Alert", {
        icon: "/logo.svg",
        body: "Countdown finished.",
        requireInteraction: false,
        silent: true,
      });
    });
}

export const useCountdownTimerState = create<CountdownTimerStore>(
  (set, get) => {
    function setState(partial: Partial<CountdownTimerState>) {
      set((store) => ({
        state: {
          activityMinutes:
            partial.activityMinutes ?? store.state.activityMinutes,
          initialMinutes: partial.initialMinutes ?? store.state.initialMinutes,
          restMinutes: partial.restMinutes ?? store.state.restMinutes,
          currentTimeInSeconds:
            partial.currentTimeInSeconds ?? store.state.currentTimeInSeconds,
          isRunning: partial.isRunning ?? store.state.isRunning,
          totalCycles: partial.totalCycles ?? store.state.totalCycles,
          isResting: partial.isResting ?? store.state.isResting,
        },
        actions: store.actions,
      }));
    }

    function start() {
      const store = get();
      if (intervalRef.current) {
        return;
      }
      if (store.state.currentTimeInSeconds <= 0) {
        return;
      }

      endTimeRef.current = addSeconds(
        new Date(),
        store.state.currentTimeInSeconds,
      );

      setState({
        isRunning: true,
      });

      intervalRef.current = setInterval(() => {
        if (!endTimeRef.current) {
          return;
        }

        const millisecondsLeft = differenceInMilliseconds(
          endTimeRef.current,
          new Date(),
        );

        if (millisecondsLeft <= 0) {
          const storeSnapshot = get();
          const isResting = storeSnapshot.state.isResting;
          const activityMinutes = storeSnapshot.state.activityMinutes;
          const restMinutes = storeSnapshot.state.restMinutes;

          stop();
          playAlertSound();

          if (isResting) {
            setState({
              initialMinutes: activityMinutes,
              currentTimeInSeconds: activityMinutes * secondsPerMinute,
              isResting: false,
            });
            return;
          }

          const completedCycles = storeSnapshot.state.totalCycles + 1;

          setState({
            initialMinutes: restMinutes,
            currentTimeInSeconds: restMinutes * secondsPerMinute,
            isResting: true,
            totalCycles: completedCycles,
          });
          return;
        }

        setState({
          currentTimeInSeconds: Math.ceil(
            millisecondsLeft / millisecondsPerSecond,
          ),
        });
      }, millisecondsPerSecond);
    }

    function stop() {
      const store = get();
      if (!store.state.isRunning && !intervalRef.current) {
        return;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      endTimeRef.current = null;

      setState({
        isRunning: false,
      });
    }

    function reset() {
      const store = get();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      endTimeRef.current = null;

      const initialSeconds = store.state.activityMinutes * secondsPerMinute;

      setState({
        initialMinutes: store.state.activityMinutes,
        currentTimeInSeconds: initialSeconds,
        isRunning: false,
        isResting: false,
      });
    }

    function updateActivityMinutes(activityMinutes: number) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      endTimeRef.current = null;

      const restMinutes = getRestMinutes(activityMinutes);
      const initialSeconds = activityMinutes * secondsPerMinute;

      setState({
        activityMinutes,
        restMinutes,
        initialMinutes: activityMinutes,
        currentTimeInSeconds: initialSeconds,
        isRunning: false,
        isResting: false,
      });
    }

    return {
      state: {
        activityMinutes: initialActivityMinutes,
        initialMinutes: initialActivityMinutes,
        restMinutes: initialRestMinutes,
        currentTimeInSeconds: initialActivityMinutes * secondsPerMinute,
        isRunning: false,
        totalCycles: 0,
        isResting: false,
      },
      actions: {
        start,
        stop,
        reset,
        updateActivityMinutes,
      },
    };
  },
);
