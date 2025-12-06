import { RotateCcw } from "lucide-react";
import Button from "../../../layout/components/atoms/Button";
import { Timer } from "../../../layout/components/common/Timer";
import { useCountdownTimerGlobal } from "../states/useCountdownTimer.global";

export function IndexTimer() {
  const start = useCountdownTimerGlobal((store) => store.actions.start);
  const stop = useCountdownTimerGlobal((store) => store.actions.stop);
  const reset = useCountdownTimerGlobal((store) => store.actions.reset);
  const currentTimeInSeconds = useCountdownTimerGlobal(
    (store) => store.state.currentTimeInSeconds
  );
  const isRunning = useCountdownTimerGlobal((store) => store.state.isRunning);
  const initialMinutes = useCountdownTimerGlobal(
    (store) => store.state.initialMinutes
  );

  const secondsPerMinute = 60;
  const hasTimerStarted =
    currentTimeInSeconds !== initialMinutes * secondsPerMinute;

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
