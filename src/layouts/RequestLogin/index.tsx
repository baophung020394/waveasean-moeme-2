import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "db/firestore";

function RequestLogin() {
  const copyRef = firebase.database().ref("copyUrls");
  useEffect(() => {
    copyRef.on("child_added", (snap: any) => {
      copyRef.child("copyUrl").update({
        ...snap.val(),
        isLogin: 1,
      });
    });
  }, []);
  return (
    <div>
      RequestLogin
      <Link to="login">Login</Link>
    </div>
  );
}

export default RequestLogin;
