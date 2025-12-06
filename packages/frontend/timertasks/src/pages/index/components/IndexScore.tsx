import { Award } from "lucide-react";
import { Box } from "../../../layout/components/atoms/Box";
import { useCountdownTimerState } from "../states/countdownTimer";

export function IndexScore() {
  const totalCycles = useCountdownTimerState(
    (store) => store.state.totalCycles
  );

  return (
    <Box className="w-64 px-6 py-4 flex items-center gap-3">
      <div className="flex items-center justify-center rounded-full bg-Green-100 text-Green-400 p-2">
        <Award size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-Black-400">Total cycles</span>
        <span className="text-2xl font-bold text-Black-700">{totalCycles}</span>
      </div>
    </Box>
  );
}

