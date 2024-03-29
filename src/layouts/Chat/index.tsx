import { sendChannelMessage2, uploadFiles } from "actions/channel";
import ChannelList from "components/ChannelList";
import ChatBar from "components/ChatBar";
import ChatMessageList from "components/ChatMessageList";
import ChatOptions from "components/ChatOptions";
import Messanger from "components/Messanger";
import TypingChat from "components/TypingChat";
import firebase, { onMessageListener } from "db/firestore";
import { withBaseLayout } from "layouts/Base";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
// import useWebSocket from "react-use-websocket";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "wss://moeme-web-dev.aveapp.com";

interface ChatProps {
  tokenNotification: string;
}

function Chat({ tokenNotification }: ChatProps) {
  const { id }: any = useParams();
  const dispatch: any = useDispatch();
  const [progressBar, setProgressBar] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<any>({});
  const userRedux = useSelector(({ auth }) => auth.user);
  const userJoinedRef = firebase.database().ref("channels");
  const messageRef = firebase.database().ref("messages");
  const [messagesState, setMessagesState] = useState([]);
  const [searchTermState, setSearchTermState] = useState("");
  const [joinedUsersState, setJoinedUsersState] = useState<any>([]);
  const currentChannel = useSelector(({ channel }) => channel?.currentChannel);
  const [scroll, setScroll] = useState<boolean>(true);
  const [newMessage, setNewMessage] = useState(0);
  const [currentMessage, setCurrentMessage] = useState<any>({});
  
  let myuuid = uuidv4();

  // const {
  //   sendMessage,
  //   sendJsonMessage,
  //   lastMessage,
  //   lastJsonMessage,
  //   readyState,
  //   getWebSocket,
  // } = useWebSocket("wss://moeme-web-dev.aveapp.com", {
  //   onOpen: () => console.log("opened"),
  //   onMessage: (data) => {
  //     console.log("data", JSON.parse(data.data));
  //   },
  //   shouldReconnect: (closeEvent) => true,
  // });

  const sendMessages = useCallback(
    (message) => {
      setCurrentMessage(message);
      dispatch(sendChannelMessage2(message, id));
    },
    [id]
  );

  onMessageListener()
    .then((payload: any) => {
      console.log({ payload });
    })
    .catch((err: any) => console.log("failed: ", err));

  /**
   * Check status and edit progress bar upload
   * @param statusProgress
   */
  const perCentUploadSuccess = (statusProgress: any) => {
    if (
      statusProgress?.percent <= 100 &&
      statusProgress?.status === "Uploading"
    ) {
      setProgressBar(statusProgress);
    } else if (
      statusProgress?.percent >= 100 &&
      statusProgress?.status === "Done"
    ) {
      setMessagesState(
        messagesState
          ?.filter((_) => _?.idMessage !== statusProgress?.idMessage)
          .map((x) =>
            x?.idMessage === statusProgress?.idMessage
              ? { ...x, files: statusProgress?.url, status: "Done" }
              : x
          )
      );
    }
  };

  /**
   * Upload image
   * @param data
   */
  const uploadImage = (data: any) => {
    // console.log("uploadImage", data);
    const newData = { ...data };
    newData.author = {
      username: userRedux?.userId || userRedux.displayName,
      id: userRedux?.uid,
    };
    newData.upload = 1;
    newData.status = "Uploading";
    messagesState.push(newData);
    setSelectedFile(data);
    dispatch(uploadFiles(data, id, messagesState, perCentUploadSuccess));
  };

  /**
   * Check new message
   */
  useEffect(() => {
    if (id) {
      setMessagesState([]);
      messageRef.child(id).on("child_added", (snap) => {
        // let config = {
        //   headers: {
        //     Authorization:
        //       "key=AAAAkYm1flQ:APA91bFvManQFeMOZJyonLN4E0CV6-nQZART0Hs53xp8Xpc81bwk44PD_sffCMSk2zTigEx6vYWAtla1PoSdOypoqHzvt05GmaKtTCrrOZnhtRb5foXT-qR0RqKnNjx3eO0Ctgaj7Tmb",
        //   },
        // };
        // axios.post(
        //   "https://fcm.googleapis.com/fcm/send",
        //   {
        //     data: {
        //       notification: {
        //         title: `${snap.val().user.username} sent for you a message`,
        //         body: `${snap.val().content}`,
        //         icon: "https://firebasestorage.googleapis.com/v0/b/moeme-chat-3.appspot.com/o/chat%2Fimages%2Fc2ff999f-2157-48e8-a9ce-d72142d3c748.jpg?alt=media&token=f43aa3ad-62e1-4cd9-8ec2-b5cb59fbaa2a",
        //         click_action: "http://localhost:8080/",
        //       },
        //     },
        //     to: tokenNotification,
        //   },
        //   config
        // );

        setMessagesState((currentState: any) => {
          let updateState = [...currentState];
          updateState.push(snap.val());
          return updateState;
        });
        setNewMessage(1);
        // setScroll(false);
      });

      messageRef.child(id).on("child_changed", (snap) => {
        console.log("child_change");
        // setScroll(true);
      });

      messageRef.child(id).on("child_removed", (snap) => {
        console.log("child_removed");
        setMessagesState([]);
      });

      return () => {
        messageRef.child(id).off();
      };
    }
  }, [id]);

  /**
   * Count user joined channel
   * @returns
   */
  const uniqueuUsersCount = () => {
    const uniqueuUsers = messagesState?.reduce((acc, message) => {
      if (!acc.includes(message?.author?.username)) {
        acc.push(message?.author?.username);
      }
      return acc;
    }, []);

    return uniqueuUsers?.length;
  };

  const searchTermChange = (searchTerm: any) => {
    setSearchTermState(searchTerm);
  };

  /**
   * Search message
   * @returns
   */
  const filterMessageBySearchTerm = () => {
    // const regex = "/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/";
    // const regex = new RegExp(searchTermState, "gi");
    const messages = messagesState.filter(
      (message) =>
        message.content.toLowerCase().includes(searchTermState.toLowerCase()) ||
        message.author.username
          .toLowerCase()
          .includes(searchTermState.toLowerCase())
    );
    // const messages = messagesState.reduce((acc, message) => {
    //   console.log("messsge reduce", message);
    //   if (
    //     (message.content && message.content?.match(regex)) ||
    //     message.author.username?.match(regex)
    //   ) {
    //     acc.push(message);
    //   }
    //   return acc;
    // }, []);

    return messages;
  };

  /**
   * Check scroll up
   * @param e
   */
  const handleScroll = (e: any) => {
    const bottom = e.scrollHeight - e.scrollTop === e.clientHeight;
    setScroll(bottom);
  };

  useEffect(() => {
    if (id) {
      let list: any = [];
      userJoinedRef
        .child(id)
        .child("joinedUsers")
        .on("child_added", (snap) => {
          list.push(snap.val());
        });
      setJoinedUsersState(list);
    }
  }, [id]);

  // useEffect(() => {
  //   if (id) {
  //     setTokenNotification("");
  //     navigator.serviceWorker.getRegistrations().then((r) => {
  //       console.log({ r });
  //       return Promise.all(r.map((reg) => reg.unregister()));
  //     });
  //     return () => {
  //       console.log("register lai");

  //       if ("serviceWorker" in navigator) {
  //         navigator.serviceWorker
  //           .register("../firebase-messaging-sw.js")
  //           .then(function (registration) {
  //             console.log("Service Worker Registered");
  //             // messaging.useServiceWorker(registration);
  //           });
  //       }

  //     };
  //   }
  // }, [id]);

  // if (!currentChannel?.id) {
  //   return <LoadingView message="Loading Chat..." />;
  // }

  return (
    <ChatStyled className="chat--view">
      <div className="chat--view__channels">
        <ChannelList />
      </div>
      <div className="chat--view__content">
        <ChatBar
          channel={currentChannel}
          uniqueuUsers={uniqueuUsersCount()}
          searchTermChange={searchTermChange}
        />

        <div className="chat--view__content__chat">
          <ChatMessageList
            setNewMessage={setNewMessage}
            onScroll={handleScroll}
            scrollBottom={scroll}
            selectedFile={selectedFile}
            progressBar={progressBar}
            uploadFileProp={uploadImage}
            messages={
              searchTermState ? filterMessageBySearchTerm() : messagesState
            }
          />

          {id && <TypingChat user={userRedux} id={id} />}

          <div className="chat--view__content__options">
            {currentChannel?.enableWriteMsg === "1" && (
              <ChatOptions submitStock={sendMessages} />
            )}
          </div>

          <Messanger
            joinedUsersState={joinedUsersState}
            messages={messagesState}
            onSubmit={sendMessages}
            channel={currentChannel}
            uploadFileProp={uploadImage}
          />
        </div>
        {userRedux?.uid !== currentMessage?.author?.id &&
          !scroll &&
          newMessage === 1 && (
            <div
              className="new-message-parent"
              onClick={() => {
                setScroll(true);
                setNewMessage(0);
              }}
            >
              <span className="new-message">New message</span>
            </div>
          )}
      </div>
    </ChatStyled>
  );
}

const ChatStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .new-message-parent {
    position: absolute;
    bottom: 180px;
    left: 50%;
    transform: translateX(-50%);
    .new-message {
      cursor: pointer;
      border-radius: 20px;
      padding: 3px 20px;
      background-color: blue;
      color: #fff;
      font-size: 14px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    }
  }
  .chat--view {
    &__channels {
      width: 33%;
      max-width: 420px;
      border-right: 1px solid #e6ecf3;
    }

    &__content {
      height: 100%;
      width: 100%;
      padding-bottom: 56px;
      position: relative;
      &__chat {
        height: calc(100% - 61px);
        display: flex;
        flex-direction: column;
      }

      &__options {
        flex: 1 1 55px;
      }
    }
  }
`;

export default withBaseLayout(Chat);
