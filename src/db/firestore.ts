import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";
import "firebase/compat/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBGUCjQm0xIt86znY82ejJDfVu09lXy5vg",
  authDomain: "moeme-chat-4.firebaseapp.com",
  projectId: "moeme-chat-4",
  storageBucket: "moeme-chat-4.appspot.com",
  messagingSenderId: "967464628472",
  appId: "1:967464628472:web:ec01242febd5bd0d9dcb0d",
  measurementId: "G-T9RJJ156KR",
};

// export const database = firebase;
export const { Timestamp } = firebase.firestore;
export default firebase.initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey: `BDhud74MhuCm-Vnq_13dPig9zebt8HBE1fioTj9JcQP97D_VNz1ONBSpwT7Tzgg7f10EuTuRrrR_wfhiA7Z5TM8`,
  });
  // .then((currentToken) => {
  //   if (currentToken) {
  //     getTokenMess(currentToken);
  //     console.log("current token for client: ", currentToken);
  //     // Perform any other neccessary action with the token
  //   } else {
  //     // Show permission request UI
  //     console.log(
  //       "No registration token available. Request permission to generate one."
  //     );
  //   }
  // })
  // .catch((err) => {
  //   console.log("An error occurred while retrieving token. ", err);
  // });
};

// Send a message to devices subscribed to the provided topic.

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log({ payload });
      resolve(payload);
    });
  });
