import { BellOff } from "lucide-react";
import { Box } from "../../../layout/components/atoms/Box";
import { Logo } from "../../../layout/components/atoms/Logo";

interface IndexNotificationRequestProps {
  permissionStatus: NotificationPermission | null;
  isRequestingPermission: boolean;
  onRequestPermission: () => void;
}

export function IndexNotificationRequest(props: IndexNotificationRequestProps) {
  return (
    <div className="body-df min-h-screen">
      <div className="flex flex-col items-center justify-center flex-1 gap-6 p-4">
        <div className="flex w-full justify-center">
          <Logo />
        </div>
        <Box className="w-full max-w-xl p-8 flex flex-col items-center gap-5 text-center">
          <div className="h-14 w-14 rounded-full bg-Blue-500/10 text-Blue-500 flex items-center justify-center">
            <BellOff size={30} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-semibold text-Black-700">Allow notifications</p>
            <p className="text-sm text-Black-400">
              We need your permission to send task reminders and track time in real time.
            </p>
          </div>
          <button
            onClick={props.onRequestPermission}
            disabled={props.isRequestingPermission}
            className="px-5 py-3 rounded-full bg-Blue-500 text-White font-semibold hover:bg-Blue-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {props.isRequestingPermission ? "Requesting permission..." : "Allow notifications"}
          </button>
          {props.permissionStatus === "denied" ? (
            <p className="text-xs text-Red-500">
              Permission denied in the browser. Enable notifications in your settings to continue.
            </p>
          ) : null}
        </Box>
      </div>
    </div>
  );
}

