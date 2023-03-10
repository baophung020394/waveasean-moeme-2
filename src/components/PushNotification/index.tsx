import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { onMessageListener, requestForToken } from "db/firestore";

const PushNotification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const notify = () => toast(<ToastDisplay />);
  function ToastDisplay() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  // requestForToken();

  onMessageListener()
    .then((payload: any) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err: any) => console.log("failed: ", err));

  return <Toaster />;
};

export default PushNotification;