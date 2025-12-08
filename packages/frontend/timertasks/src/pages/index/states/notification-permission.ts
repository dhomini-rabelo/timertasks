import { atom } from "jotai";

interface NotificationPermissionState {
 permissionStatus: NotificationPermission | null;
  isRequestingPermission: boolean;
}

export const notificationPermissionAtom = atom<NotificationPermissionState>({
  permissionStatus: null,
  isRequestingPermission: false,
});