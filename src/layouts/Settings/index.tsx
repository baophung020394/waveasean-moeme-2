import { logout } from "actions/auth";
import Button from "components/common/Header/Button";
import { withBaseLayout } from "layouts/Base";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import { styled } from "utils/styled-component";
import firebase from "db/firestore";
import { Card, Image } from "semantic-ui-react";
import FacebookLogin from "react-facebook-login";

function Settings() {
  const dispatch: any = useDispatch();
  const user = useSelector(({ auth }) => auth?.user);
  const history = useHistory();
  const [connectedUserState, setConnectedUserState] = useState([]);
  const [usersState, setUsersState] = useState([]);
  const connectedRef = firebase.database().ref(".info/connected");
  const usersRef = firebase.database().ref("users");
  const statusRef = firebase.database().ref("status");
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
  });
  const [picture, setPicture] = useState("");

  const responseFacebook = (response) => {
    console.log(response);
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

  const handleLogout = () => {
    connectedRef.on("value", (snap) => {
      if (snap.val()) {
        console.log("logout");
        // const userStatusRef = statusRef.child(JSON.parse(localStorage.getItem("_profile")).params.user);
        // userStatusRef.set(false);
        // userStatusRef.onDisconnect().remove();
      }
    });

    // statusRef.on("child_removed", (snap) => {
    //   console.log("removed");
    //   setConnectedUserState((currentState) => {
    //     let updatedState = [...currentState];

    //     let index = updatedState.indexOf(snap.key);
    //     updatedState.splice(index, 1);
    //     return updatedState;
    //   });
    // });
    dispatch(logout());
    history.push("/login");
  };

  // useEffect(() => {
  //   usersRef.on("child_added", (snap) => {
  //     setUsersState((currentUser: any) => {
  //       let updateState = [...currentUser];

  //       let user = snap.val();
  //       user.username = user.username;
  //       user.id = snap.key;
  //       user.isPrivateChat = true;
  //       updateState.push(user);
  //       return updateState;
  //     });
  //   });

  //   connectedRef.on("value", (snap) => {
  //     if (user && snap.val()) {
  //       const userStatusRef = statusRef.child(user.uid);
  //       userStatusRef.set(true);

  //       userStatusRef.onDisconnect().remove();
  //     }
  //   });

  //   return () => {
  //     usersRef.off();
  //     connectedRef.off();
  //   };
  // }, [user]);

  return (
    <SettingsStyled>
      <h1>Settings page</h1>
      <Button
        type="button"
        name="Logout"
        className="btn-login"
        inputColor="primary"
        onClick={() => handleLogout()}
      ></Button>

      {/* <Card style={{ width: "600px" }}>
        <Card.Header>
          {!login && (
            <FacebookLogin
              appId="1243691742899004"
              autoLoad={true}
              fields="name,email,picture"
              scope="public_profile,user_friends"
              callback={responseFacebook}
              icon="fa-facebook"
            />
          )}
          {login && <Image src={picture} roundedCircle />}
        </Card.Header>
        {login && (
          <>
            {data.name}
            {data.email}
          </>
        )}
      </Card> */}
    </SettingsStyled>
  );
}

const SettingsStyled = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

export default withBaseLayout(Settings);
