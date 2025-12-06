import { Logo } from "../../layout/components/atoms/Logo";
import { IndexScore } from "./components/IndexScore";
import { IndexTasks } from "./components/IndexTasks/IndexTasks";
import { IndexTimer } from "./components/IndexTimer";

export function IndexPage() {
  return (
    <div className="body-df min-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex w-full justify-center pb-4 pt-2">
        <Logo />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-16 w-full">
        <div className="shrink-0 md:self-start pt-4 flex flex-col gap-8">
          <IndexTimer />
          <IndexScore />
        </div>
        <div className="flex-1 w-full max-w-2xl">
          <IndexTasks />
        </div>
      </div>
    </div>
  );
}
