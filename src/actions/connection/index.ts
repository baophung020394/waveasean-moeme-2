import * as api from "api/connection";

export const checkUserConnection = (uid: string) => (dispatch: any) =>
  api.onConnectionChanged((isConnected: any, uid: string) => {
    console.log({ isConnected });
    api.setUserOnlineStatus(uid, isConnected);
    dispatch({ type: "CONNECTION_USER_STATUS_CHANGED" });
  });
