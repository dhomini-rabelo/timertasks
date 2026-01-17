import { Settings } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";
import { Button } from "../../../layout/components/atoms/Button";
import { Dialog } from "../../../layout/components/atoms/Dialog";
import { useCountdownTimerState } from "../states/countdownTimer";

interface UpdateTimerDialogProps {
  trigger?: ReactNode;
}

const minimumActivityMinutes = 10;
const maximumActivityMinutes = 50;

function formatMinutes(minutes: number) {
  if (Number.isInteger(minutes)) {
    return minutes.toString();
  }

  return minutes.toFixed(1);
}

export function UpdateTimerDialog({ trigger }: UpdateTimerDialogProps) {
  const activityMinutes = useCountdownTimerState(
    (store) => store.state.activityMinutes,
  );
  const restMinutes = useCountdownTimerState(
    (store) => store.state.restMinutes,
  );
  const updateActivityMinutes = useCountdownTimerState(
    (store) => store.actions.updateActivityMinutes,
  );

  function handleActivityMinutesChange(event: ChangeEvent<HTMLInputElement>) {
    const nextMinutes = Number(event.target.value);
    updateActivityMinutes(nextMinutes);
  }

  function getTrigger() {
    if (trigger) {
      return trigger;
    }

    return (
      <Button className="px-3 py-2 text-base font-medium" variant="secondary">
        <Settings size={20} />
      </Button>
    );
  }

  const footer = (
    <div className="flex items-center justify-between text-sm text-Black-300">
      <span>Resting time (20%)</span>
      <span>{formatMinutes(restMinutes)} min</span>
    </div>
  );

  return (
    <Dialog
      title="Pomodoro settings"
      description="Adjust the activity duration for this cycle."
      trigger={getTrigger()}
      footer={footer}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm font-medium text-Black-500">
          <span>Activity time</span>
          <span>{activityMinutes} min</span>
        </div>
        <input
          type="range"
          min={minimumActivityMinutes}
          max={maximumActivityMinutes}
          step={1}
          value={activityMinutes}
          onChange={handleActivityMinutesChange}
          className="w-full accent-Green-400 cursor-pointer"
        />
        <div className="flex items-center justify-between text-xs text-Black-300">
          <span>{minimumActivityMinutes} min</span>
          <span>{maximumActivityMinutes} min</span>
        </div>
      </div>
    </Dialog>
  );
}
