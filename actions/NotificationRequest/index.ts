import { useCallback } from "react";
import {
  MiniKit,
  RequestPermissionPayload,
  Permission,
} from "@worldcoin/minikit-js";

// Example function of how to use the command
const requestPermission = useCallback(async () => {
  const requestPermissionPayload: RequestPermissionPayload = {
    permission: Permission.Notifications,
  };
  const payload = await MiniKit.commandsAsync.requestPermission(
    requestPermissionPayload
  );
  // Handle the response
}, []);
