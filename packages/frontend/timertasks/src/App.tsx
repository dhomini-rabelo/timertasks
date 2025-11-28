import Button from "./layout/components/atoms/Button";
import { Timer } from "./layout/components/common/Timer";
import { useTimer } from "./layout/components/common/Timer/hooks/useTimer";
import "./layout/styles/global.css";

function App() {
  const initialTimeInMinutes = 25;
  const { actions: timerActions, state: timerState } = useTimer({
    initialMinutes: initialTimeInMinutes,
  });

  return (
    <div className="body-df">
      <div className="w-64">
        <Timer
          className="w-full h-64 text-6xl"
          timerDisplayInSeconds={timerState.currentTimeInSeconds.toString()}
          initialTimeInMinutes={initialTimeInMinutes}
        />
        <div className="pt-4">
          {timerState.isRunning ? (
            <Button
              className="w-full py-2 text-base font-medium"
              onClick={timerActions.stop}
            >
              Stop
            </Button>
          ) : (
            <Button
              className="w-full py-2 text-base font-medium"
              onClick={timerActions.start}
            >
              Start
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
