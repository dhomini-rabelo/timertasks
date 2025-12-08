import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../../../layout/components/atoms/Button";
import { Timer } from "../../../layout/components/common/Timer";
import { useCountdownTimerState } from "../states/countdownTimer";

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

export function IndexTimer() {
  const start = useCountdownTimerState((store) => store.actions.start);
  const stop = useCountdownTimerState((store) => store.actions.stop);
  const reset = useCountdownTimerState((store) => store.actions.reset);
  const currentTimeInSeconds = useCountdownTimerState(
    (store) => store.state.currentTimeInSeconds
  );
  const isRunning = useCountdownTimerState((store) => store.state.isRunning);
  const initialMinutes = useCountdownTimerState(
    (store) => store.state.initialMinutes
  );

  const secondsPerMinute = 60;
  const hasTimerStarted =
    currentTimeInSeconds !== initialMinutes * secondsPerMinute;

  useEffect(() => {
    if (currentTimeInSeconds === 0) {
      playAlertSound();
      return;
    }
  }, [currentTimeInSeconds]);

  return (
    <div className="w-64">
      <Timer
        className="w-full h-64 text-6xl"
        timerDisplayInSeconds={currentTimeInSeconds.toString()}
        initialTimeInMinutes={initialMinutes}
      />
      <div className="pt-4 flex flex-col gap-4 px-8">
        {isRunning ? (
          <Button
            className="w-full py-2 text-base font-medium"
            variant="danger"
            onClick={stop}
          >
            Stop
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 py-2 text-base font-medium"
              variant="primary"
              onClick={start}
            >
              {hasTimerStarted ? "Resume" : "Start"}
            </Button>

            {hasTimerStarted && (
              <Button
                className="px-2 py-2 text-base font-medium"
                variant="secondary"
                onClick={reset}
              >
                <RotateCcw size={20} />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
