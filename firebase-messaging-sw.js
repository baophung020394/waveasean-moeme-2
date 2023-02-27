// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBORxYGcGfL8wWyZAK7x1zhve5vjL8jgDM",
  authDomain: "moeme-chat-3.firebaseapp.com",
  projectId: "moeme-chat-3",
  storageBucket: "moeme-chat-3.appspot.com",
  messagingSenderId: "625080630868",
  appId: "1:625080630868:web:e4c7dc2c2b049477e077c1",
  measurementId: "G-GEMLJE9GBV",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload.data.notification);
  console.log("payload", JSON.parse(payload.data.notification).body);
  const notificationTitle = JSON.parse(payload.data.notification).title;
  const notificationOptions = {
    title: JSON.parse(payload.data.notification).title,
    body: JSON.parse(payload.data.notification).body,
    // icon: '/firebase-logo.png'
  };

  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  // };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
// Open/focus link in a notification message.
