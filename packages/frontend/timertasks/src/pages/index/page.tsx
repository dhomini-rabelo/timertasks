import { useEffect, useState } from "react";
import { Logo } from "../../layout/components/atoms/Logo";
import { IndexNotificationRequest } from "./components/IndexNotificationRequest";
import { IndexScore } from "./components/IndexScore";
import { IndexTasks } from "./components/IndexTasks/IndexTasks";
import { IndexTimer } from "./components/IndexTimer";

interface IndexPageState {
  permissionStatus: NotificationPermission | null;
  isRequestingPermission: boolean;
}

export function IndexPage() {
  const [state, setState] = useState<IndexPageState>({
    permissionStatus: null,
    isRequestingPermission: false,
  });

  function handleRequestPermission() {
    const isNotificationSupported =
      typeof window !== "undefined" && typeof Notification !== "undefined";

    if (!isNotificationSupported) {
      setState((currentState) => ({
        ...currentState,
        permissionStatus: "denied",
      }));
      return;
    }

    setState((currentState) => ({
      ...currentState,
      isRequestingPermission: true,
    }));

    Notification.requestPermission()
      .then((permissionStatus) => {
        setState((currentState) => ({
          ...currentState,
          permissionStatus: permissionStatus,
          isRequestingPermission: false,
        }));
      })
      .catch(() => {
        setState((currentState) => ({
          ...currentState,
          permissionStatus: "denied",
          isRequestingPermission: false,
        }));
      });
  }

  useEffect(() => {
    const isNotificationSupported =
      typeof window !== "undefined" && typeof Notification !== "undefined";

    if (!isNotificationSupported) {
      setState((currentState) => ({
        ...currentState,
        permissionStatus: "denied",
      }));
      return;
    }

    if (Notification.permission === "default") {
      handleRequestPermission();
    } else {
      setState((currentState) => ({
        ...currentState,
        permissionStatus: Notification.permission,
      }));
    }
  }, [setState]);

  const shouldBlockContent = state.permissionStatus !== "granted";

  if (shouldBlockContent) {
    return (
      <IndexNotificationRequest
        permissionStatus={state.permissionStatus}
        isRequestingPermission={state.isRequestingPermission}
        onRequestPermission={handleRequestPermission}
      />
    );
  }

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
