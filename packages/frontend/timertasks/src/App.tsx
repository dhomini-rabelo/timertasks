import Button from "./layout/components/atoms/Button";
import { Timer } from "./layout/components/common/Timer";
import { useTimer } from "./layout/components/common/Timer/hooks/useTimer";
import "./layout/styles/global.css";

function App() {
  const { actions: timerActions, state: timerState } = useTimer({
    initialMinutes: 25,
  });

  return (
    <div className="body-df">
      <div className="w-64">
        <Timer
          className="w-full h-64 text-6xl"
          timerDisplayInSeconds={timerState.currentTimeInSeconds.toString()}
        />
        <div className="pt-4">
          <Button
            className="w-full py-2 text-base font-medium"
            onClick={timerActions.start}
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
