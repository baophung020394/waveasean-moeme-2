import { sendChannelMessage2, uploadFiles } from "actions/channel";
import ChatBar from "components/ChatBar";
import ChatMessageList from "components/ChatMessageList";
import Messanger from "components/Messanger";
import LoadingView from "components/Spinner/LoadingView";
import firebase from "db/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

interface PrivateChatProps {
  user?: any;
}

function PrivateChat({ user }: PrivateChatProps) {
  const dispatch: any = useDispatch();
  const currentChannel = useSelector(({ channel }) => channel.currentChannel);
  const userRedux = useSelector(({ auth }) => auth.user);
  const messageRef = firebase.database().ref("messages");
  const [messagesState, setMessagesState] = useState([]);
  const [searchTermState, setSearchTermState] = useState("");
  const [progressBar, setProgressBar] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<any>({});
  const userJoinedRef = firebase.database().ref("users");
  const [joinedUsersState, setJoinedUsersState] = useState<any>([]);

  const sendMessage = useCallback(
    (message) => {
      dispatch(sendChannelMessage2(message, user?.id));
    },
    [user?.id]
  );

  const uploadImage = (data: any) => {
    const newData = { ...data };
    newData.author = {
      username: userRedux?.userId || userRedux.displayName,
      id: userRedux?.uid,
    };
    newData.upload = 1;
    newData.status = "Uploading";
    messagesState.push(newData);

    setSelectedFile(data);
    dispatch(uploadFiles(data, user?.id, messagesState, perCentUploadSuccess));
  };

  useEffect(() => {
    if (user?.id) {
      setMessagesState([]);
      messageRef.child(user?.id).on("child_added", (snap) => {
        setMessagesState((currentState: any) => {
          let updateState = [...currentState];
          updateState.push(snap.val());
          return updateState;
        });
      });

      return () => messageRef.child(user?.id).off();
    }
  }, [user?.id]);

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

    return messages;
  };

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

  // useEffect(() => {
  //   if (user?.id) {
  //     let list: any = [];
  //     userJoinedRef
  //       .child(user?.id)
  //       .child("joinedUsers")
  //       .on("child_added", (snap) => {
  //         console.log("snap.val()", snap.val());
  //         list.push(snap.val());
  //       });
  //     setJoinedUsersState(list);
  //   }
  // }, [user?.id]);

  // if (!currentChannel?.id) {
  //   return <LoadingView message="Loading Chat..." />;
  // }

  return (
    <ChatStyled className="chat--view">
      <div className="chat--view__content">
        <ChatBar
          channel={user}
          uniqueuUsers={uniqueuUsersCount()}
          searchTermChange={searchTermChange}
        />
        <div className="chat--view__content__chat">
          <ChatMessageList
            selectedFile={selectedFile}
            progressBar={progressBar}
            uploadFileProp={uploadImage}
            messages={
              searchTermState ? filterMessageBySearchTerm() : messagesState
            }
          />
          <Messanger
            joinedUsersState={joinedUsersState}
            messages={messagesState}
            onSubmit={sendMessage}
            channel={currentChannel}
            uploadFileProp={uploadImage}
          />
        </div>
      </div>
    </ChatStyled>
  );
}

const ChatStyled = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .chat--view {
    &__content {
      height: 100%;
      width: 100%;
      padding-bottom: 56px;

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

export default PrivateChat;
