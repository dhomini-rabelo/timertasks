import { useAtom } from "jotai";
import { useEffect } from "react";
import { Logo } from "../../layout/components/atoms/Logo";
import { IndexNotificationRequest } from "./components/IndexNotificationRequest";
import { IndexScore } from "./components/IndexScore";
import { IndexTasks } from "./components/IndexTasks/IndexTasks";
import { IndexTimer } from "./components/IndexTimer";
import { notificationPermissionAtom } from "./states/notification-permission";

export function IndexPage() {
  const [stateNotificationPermission, setStateNotificationPermission] = useAtom(
    notificationPermissionAtom
  );
  const shouldBlockContent =
    stateNotificationPermission.permissionStatus !== "granted";
  const hasInitializedPermissionStatus =
    stateNotificationPermission.permissionStatus !== null;

  useEffect(() => {
    const isNotificationSupported =
      typeof window !== "undefined" && typeof Notification !== "undefined";

    if (!isNotificationSupported) {
      setStateNotificationPermission((currentState) => ({
        ...currentState,
        permissionStatus: "denied",
      }));
      return;
    }

    setStateNotificationPermission((currentState) => ({
      ...currentState,
      permissionStatus: Notification.permission,
    }));
  }, []);

  return (
    <div className="body-df min-h-screen max-h-screen flex flex-col items-center justify-center p-4">
      <div className="flex w-full justify-center pb-4 pt-2">
        <Logo />
      </div>
      {hasInitializedPermissionStatus && (
        <>
          {shouldBlockContent ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-6 p-4">
              <IndexNotificationRequest />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-16 w-full">
              <div className="shrink-0 md:self-start pt-4 flex flex-col gap-8">
                <IndexTimer />
                <IndexScore />
              </div>
              <div className="flex-1 w-full max-w-2xl">
                <IndexTasks />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
