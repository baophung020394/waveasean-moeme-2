export const sendChatMessage =
  (message: any, chatId: string) => (dispatch: any, getState: any) => {
    console.log({ message });
    console.log({ chatId });
    const newMessage = { ...message };
    const user = JSON.parse(localStorage.getItem("_profile"));
    console.log({ user });
    // const userRef = db.doc(`profiles/${user.uid}`);
    newMessage.author = user;

    return dispatch({ type: "CHATS_MESSAGE_SENT" })
    // console.log({ newMessage });

    // return api
    //   .sendChatMessage(newMessage, chatId)
    //   .then((_) => dispatch({ type: "CHATS_MESSAGE_SENT" }));
  };
