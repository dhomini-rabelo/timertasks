import { RotateCcw } from "lucide-react";
import Button from "../../../layout/components/atoms/Button";
import { Timer } from "../../../layout/components/common/Timer";
import { useCountdownTimer } from "../../../layout/components/common/Timer/hooks/useCountdownTimer";

export function IndexTimer() {
  const initialTimeInMinutes = 25;
  const { actions: timerActions, state: timerState } = useCountdownTimer({
    initialMinutes: initialTimeInMinutes,
  });
  const hasTimerStarted =
    timerState.currentTimeInSeconds !== initialTimeInMinutes * 60;

  return (
    <div className="w-64">
      <Timer
        className="w-full h-64 text-6xl"
        timerDisplayInSeconds={timerState.currentTimeInSeconds.toString()}
        initialTimeInMinutes={initialTimeInMinutes}
      />
      <div className="pt-4 flex flex-col gap-4 px-8">
        {timerState.isRunning ? (
          <Button
            className="w-full py-2 text-base font-medium"
            variant="danger"
            onClick={timerActions.stop}
          >
            Stop
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              className="flex-1 py-2 text-base font-medium"
              variant="primary"
              onClick={timerActions.start}
            >
              {hasTimerStarted ? "Resume" : "Start"}
            </Button>

            {hasTimerStarted && (
              <Button
                className="px-2 py-2 text-base font-medium"
                variant="secondary"
                onClick={timerActions.reset}
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
