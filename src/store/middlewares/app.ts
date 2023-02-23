import Notification from "utils/notification";

export default (store: any) => (next: any) => (action: any) => {
  switch (action.type) {
    case "APP_IS_ONLINE":
    case "APP_IS_OFFLINE": {
      Notification.show({
        title: "Connection status:",
        body: action.isOnline ? "Online" : "Offline",
      });
    }

    // case "AUTH_LOGGOUT_SUCCESS": {
    //   const { messagesSubs } = store.getState().chats;

    //   if (messagesSubs) {
    //     Object.keys(messagesSubs).forEach((messageSub) => {
    //       messagesSubs[messageSub]();
    //     });
    //   }
    // }
  }

  next(action);
};
