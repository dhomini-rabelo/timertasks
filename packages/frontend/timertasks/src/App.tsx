import Button from "./layout/components/atoms/Button";
import { Timer } from "./layout/components/common/Timer";
import "./layout/styles/global.css";

function App() {
  return (
    <div className="body-df">
      <div className="w-64">
        <Timer className="w-full h-64 text-6xl" />
        <div className="pt-4">
          <Button className="w-full py-2 text-base font-medium">Start</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
