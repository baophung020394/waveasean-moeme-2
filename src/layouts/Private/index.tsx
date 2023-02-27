import { setCurrentChannel } from "actions/channel";
import { Notification } from "components/Notifications";
import PrivateChat from "components/PrivateChat";
import firebase from "db/firestore";
import { withBaseLayout } from "layouts/Base";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "semantic-ui-react";
import styled from "styled-components";
import { createTimestamp } from "utils/time";

interface PrivateProps {
  usersRef: any;
  statusRef: any;
  connectedRef: any;
}
function Private({ usersRef, statusRef, connectedRef }: PrivateProps) {
  const [usersState, setUsersState] = useState([]);
  const [userState, setUserState] = useState({});
  const [connectedUserState, setConnectedUserState] = useState([]);
  const userRedux = useSelector(({ auth }: any) => auth.user);
  // const usersRef = firebase.database().ref("users");
  // const connectedRef = firebase.database().ref(".info/connected");
  // const statusRef = firebase.database().ref("status");
  const currentChannel = useSelector(
    ({ channel }: any) => channel.currentChannel
  );

  const dispatch: any = useDispatch();

  const selectUser = (user: any, isClicked: boolean) => {
    console.log({ user });
    if (user) {
      let userTemp = { ...user };
      userTemp.id = generateChannelId(user?.id);
      console.log(userTemp.id);

      setUserState(userTemp);
      setLastVisited(userRedux, currentChannel);
      setLastVisited(userRedux, userTemp);
      dispatch(setCurrentChannel(userTemp, isClicked));
    }
  };

  const generateChannelId = (userId: string) => {
    if (userRedux.uid < userId) {
      return userRedux.uid + userId;
    } else {
      return userId + userRedux.uid;
    }
  };

  useEffect(() => {
    usersRef.on("child_added", (snap) => {
      setUsersState((currentUser: any) => {
        let updateState = [...currentUser];
        let user = snap.val();
        user.username = user.username;
        user.id = snap.key;
        user.isPrivateChat = true;
        updateState.push(user);
        return updateState;
      });
    });

    // connectedRef.on("value", (snap) => {
    //   if (userRedux && snap.val()) {
    //     const userStatusRef = statusRef.child(userRedux.uid);
    //     userStatusRef.set(true);

    //     userStatusRef.onDisconnect().remove();
    //   }
    // });

    // return () => {
    //   usersRef.off();
    //   connectedRef.off();
    // };
  }, [userRedux]);

  useEffect(() => {
    statusRef.on("child_added", (snap) => {
      setConnectedUserState((currentState) => {
        let updatedState = [...currentState];
        updatedState.push(snap.key);
        return updatedState;
      });
    });

    statusRef.on("child_removed", (snap) => {
      setConnectedUserState((currentState) => {
        let updatedState = [...currentState];

        let index = updatedState.indexOf(snap.key);
        updatedState.splice(index, 1);
        return updatedState;
      });
    });

    return () => statusRef.off();
  }, [usersState]);

  const displayUsers = () => {
    if (usersState?.length > 0) {
      return usersState
        .filter((us: any) => us.id !== userRedux.uid && us.uid !== undefined)
        .map((u) => {
          return (
            <li
              key={u.id}
              onClick={(e) => {
                e.preventDefault();
                selectUser(u, true);
              }}
            >
              <div className="infor-user">
                <Image src={`${u?.photoURL}`} avatar />
                {/* <object
                  className="icon40 avatar"
                  data={`http://moa.aveapp.com:21405/file/api/down_proc.jsp?type=12&userid=${u?.userId}`}
                  type="image/png"
                  onClick={(e) => e.preventDefault()}
                  style={{ pointerEvents: "none" }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                    alt="avatar"
                    className="icon40 avatar"
                  />
                </object> */}
                <span>{u?.username}</span>
              </div>
              <div className="status-user">
                {connectedUserState.indexOf(u.id) !== -1 ? (
                  <span className="status green"></span>
                ) : (
                  <span className="status red"></span>
                )}
                <Notification
                  displayName={u.username}
                  userProps={userRedux}
                  notificationChannelId={generateChannelId(u.id)}
                  channel={currentChannel}
                />
              </div>
            </li>
          );
        });
    }
  };

  const setLastVisited = (user: any, channel: any) => {
    if (channel) {
      const lastVisited = usersRef
        .child(user.uid)
        .child("lastVisited")
        .child(channel?.id);
      lastVisited.set(createTimestamp());
    }
  };

  useEffect(() => {
    if (usersState?.length > 0) {
      setUserState(usersState.filter((us: any) => us.id !== userRedux.uid)[0]);
      selectUser(
        usersState.filter((us: any) => us.id !== userRedux.uid)[0],
        false
      );
    }
  }, [usersState?.length]);

  return (
    <ChannelStyled className="private-container">
      <div className="private-container__list">
        <ul className="ul-list"> {displayUsers()}</ul>
        {userState && <PrivateChat user={userState} />}
      </div>
    </ChannelStyled>
  );
}

const ChannelStyled = styled.div`
  //   display: flex;
  width: 100%;
  height: 100%;

  .private-container {
    &__list {
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: row;
      .ul-list {
        list-style: none;
        padding: 1rem;
        width: 33%;
        max-width: 420px;
        border-right: 1px solid #e6ecf3;

        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
          padding: 5px 10px;
          margin-bottom: 16px;
          cursor: pointer;
          border-radius: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          .infor-user {
            dispaly: flex;
            align-items: center;
          }
          .status-user {
            display: flex;
            align-items: center;

            p {
              order: 0;
              background: red;
              color: #fff;
              width: 20px;
              height: 20px;
              text-align: center;
              font-size: 12px;
              line-height: 20px;
              border-radius: 8px;
              margin-right: 8px;
            }

            .status {
              display: inline-block;
              border-radius: 100%;
              box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
              width: 15px;
              height: 15px;
              order: 1;

              &.green {
                background-color: green;
              }

              &.red {
                background-color: red;
              }
            }
          }
        }
      }
    }
  }
`;

export default withBaseLayout(Private);
