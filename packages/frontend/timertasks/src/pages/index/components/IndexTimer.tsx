import { RotateCcw } from "lucide-react";
import { SECONDS_PER_MINUTE } from "../../../code/utils/date";
import { Button } from "../../../layout/components/atoms/Button";
import { Timer } from "../../../layout/components/common/Timer";
import { useCountdownTimerState } from "../states/countdownTimer";
import { UpdateTimerDialog } from "./UpdateTimerDialog";

export function IndexTimer() {
  const start = useCountdownTimerState((store) => store.actions.start);
  const stop = useCountdownTimerState((store) => store.actions.stop);
  const reset = useCountdownTimerState((store) => store.actions.reset);
  const currentTimeInSeconds = useCountdownTimerState(
    (store) => store.state.currentTimeInSeconds,
  );
  const isRunning = useCountdownTimerState((store) => store.state.isRunning);
  const isResting = useCountdownTimerState((store) => store.state.isResting);
  const initialMinutes = useCountdownTimerState(
    (store) => store.state.initialMinutes,
  );
  const hasTimerStarted =
    currentTimeInSeconds !== initialMinutes * SECONDS_PER_MINUTE;
  const shouldShowSettingsButton = !isRunning && !isResting && !hasTimerStarted;

  return (
    <div className="w-64">
      <Timer
        className="w-full h-64 text-6xl"
        timerDisplayInSeconds={currentTimeInSeconds.toString()}
        initialTimeInMinutes={initialMinutes}
        strokeColor={
          isResting ? "var(--color-Blue-400)" : "var(--color-Green-400)"
        }
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
              variant={isResting ? "secondary" : "primary"}
              onClick={start}
            >
              {isResting
                ? hasTimerStarted
                  ? "Resume"
                  : "Rest"
                : hasTimerStarted
                  ? "Resume"
                  : "Start"}
            </Button>

            {shouldShowSettingsButton ? <UpdateTimerDialog /> : null}

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
