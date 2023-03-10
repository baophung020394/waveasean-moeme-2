import { listenToConnectionChanges } from "actions/app";
import { listenToAuthChanges } from "actions/auth";
import PrivateChat from "components/PrivateChat";
import LoadingView from "components/Spinner/LoadingView";
import firebase, { requestForToken } from "db/firestore";
import RequestLogin from "layouts/RequestLogin";
import ChannelView from "layouts/Channel";
import ChatView from "layouts/Chat";
import HomeView from "layouts/Home";
import LoginView from "layouts/Login";
import PrivateView from "layouts/Private";
import ProfileView from "layouts/Profile";
import RegisterView from "layouts/Register";
import SettingsView from "layouts/Settings";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import StoreProvider from "store/StoreProvider";
import Header from "./components/common/Header";

export const AuthRoute = ({ children, ...rest }: any) => {
  const user = useSelector(({ auth }: any) => auth.user);
  const onlyChild = React.Children.only(children);

  console.log("user ne", user);
  return (
    <Route
      {...rest}
      render={(props: any) => {
        return user ? (
          React.cloneElement(onlyChild, { ...rest, ...props })
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
    // <Route
    //   {...rest}
    //   render={(props) => {
    //     if (
    //       props?.match.params.id &&
    //       localStorage.getItem("urlCopy")?.length > 0
    //     ) {
    //       console.log({ props });
    //       console.log("co");
    //       return React.cloneElement(onlyChild, { ...rest, ...props });
    //     } else {
    //       return user ? (
    //         React.cloneElement(onlyChild, { ...rest, ...props })
    //       ) : (
    //         <Redirect to="/login" />
    //       );
    //     }
    //   }}
    // />
  );
};

const ContentWrapper = ({ children }: any) => (
  <div className="content-page">{children}</div>
);

function MoeMe() {
  const dispatch: any = useDispatch();
  const isOnline = useSelector(({ app }: any) => app.isOnline);
  const isChecking = useSelector(({ auth }: any) => auth.isChecking);
  const user = useSelector(({ auth }: any) => auth.user);
  const usersRef = firebase.database().ref("users");
  const statusRef = firebase.database().ref("status");
  const connectedRef = firebase.database().ref(".info/connected");
  const [tokenNotification, setTokenNotification] = useState("");
  const copyRef = firebase.database().ref("copyUrls");

  useEffect(() => {
    const tokenmess = requestForToken();

    tokenmess
      .then((currentToken) => {
        if (currentToken) {
          console.log("channel id - :");
          console.log("current token for client: ", currentToken);
          setTokenNotification(currentToken);
          // Perform any other neccessary action with the token
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
      });
  }, []);

  useEffect(() => {
    connectedRef.on("value", (snap) => {
      if (user && user?.uid && snap.val()) {
        copyRef.on("child_added", (snap: any) => {
          console.log("snap.val()", snap.val());
          if (snap.val()?.id) {
            window.location.href = `/#${snap.val().url}`;
          } else {
            window.location.href = `/#/`;
          }
        });

        const userStatusRef = statusRef.child(user?.uid);
        userStatusRef.set(true);

        userStatusRef.onDisconnect().remove();
      }
    });

    return () => {
      usersRef.off();
      connectedRef.off();
    };
  }, [user]);

  useEffect(() => {
    const unsubFromAuth = dispatch(listenToAuthChanges());
    const unsubFromConnection = dispatch(listenToConnectionChanges());

    return () => {
      unsubFromAuth();
      unsubFromConnection();
    };
  }, [dispatch]);

  if (!isOnline) {
    return (
      <LoadingView message="MoeMe has been disconnected from the internet. Please reconnect...." />
    );
  }

  if (isChecking) {
    return <LoadingView message="Load app..." />;
  }

  return (
    <Router>
      <Header />
      <ContentWrapper>
        <Switch>
          <Route path="/login">
            <LoginView />
          </Route>

          <Route path="/request-login">
            <RequestLogin />
          </Route>

          <Route path="/register">
            <RegisterView />
          </Route>
          <AuthRoute path="/home">
            <HomeView />
          </AuthRoute>
          <AuthRoute path="/channel">
            <ChannelView />
          </AuthRoute>
          <AuthRoute path="/channel-detail/:id">
            <ChatView tokenNotification={tokenNotification} />
          </AuthRoute>
          <AuthRoute path="/private">
            <PrivateView usersRef={usersRef} statusRef={statusRef} />
          </AuthRoute>
          <AuthRoute path="/private-detail/:id">
            <PrivateChat />
          </AuthRoute>
          <AuthRoute path="/profile">
            <ProfileView user={user} />
          </AuthRoute>
          <AuthRoute path="/settings">
            <SettingsView />
          </AuthRoute>
          <Redirect path="*" to="/login" />
        </Switch>
      </ContentWrapper>
    </Router>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MoeMe />
    </StoreProvider>
  );
}
