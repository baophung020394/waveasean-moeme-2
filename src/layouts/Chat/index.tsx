import { sendChatMessage } from "actions/chat";
import ChatBar from "components/ChatBar";
import ChatMessageList from "components/ChatMessageList";
import ChatOptions from "components/ChatOptions";
import Messanger from "components/Messanger";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import {
  clearNotifications,
  registerMessageSubscription,
  sendChannelMessage,
  sendChannelMessage2,
  subscribeToChannel,
  subscribeToMessages,
  subscribeToProfile,
  uploadFiles,
} from "actions/channel";
import LoadingView from "components/Spinner/LoadingView";
import ChannelList from "components/ChannelList";
import { withBaseLayout } from "layouts/Base";
import firebase from "db/firestore";

interface ChatProps {}

function Chat({}: ChatProps) {
  const { id }: any = useParams();
  const dispatch: any = useDispatch();
  const [progressBar, setProgressBar] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<any>({});
  const joinedChannels = useSelector(({ channel }) => channel.joined);
  const userRedux = useSelector(({ auth }) => auth.user);
  const userJoinedRef = firebase.database().ref("channels");
  const messageRef = firebase.database().ref("messages");
  const [messagesState, setMessagesState] = useState([]);
  const [searchTermState, setSearchTermState] = useState("");
  const [joinedUsersState, setJoinedUsersState] = useState<any>([]);
  const currentChannel = useSelector(({ channel }) => channel?.currentChannel);

  const sendMessage = useCallback(
    (message) => {
      dispatch(sendChannelMessage2(message, id));
    },
    [id]
  );

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

  useEffect(() => {
    if (id) {
      setMessagesState([]);
      messageRef.child(id).on("child_added", (snap) => {
        setMessagesState((currentState: any) => {
          let updateState = [...currentState];
          updateState.push(snap.val());
          return updateState;
        });
      });

      return () => messageRef.child(id).off();
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

  // useEffect(() => {
  //   if (id) {
  //     let list: any = [];
  //     userJoinedRef
  //       .child(id)
  //       .child("joinedUsers")
  //       .on("child_added", (snap) => {
  //         console.log("snap.val()", snap.val());
  //         list.push(snap.val());
  //       });
  //     setJoinedUsersState(list);
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
            selectedFile={selectedFile}
            progressBar={progressBar}
            uploadFileProp={uploadImage}
            messages={
              searchTermState ? filterMessageBySearchTerm() : messagesState
            }
          />
          <div className="chat--view__content__options">
            {currentChannel?.enableWriteMsg === "1" && (
              <ChatOptions submitStock={sendMessage} />
            )}
          </div>
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
    &__channels {
      width: 33%;
      max-width: 420px;
      border-right: 1px solid #e6ecf3;
    }

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

export default withBaseLayout(Chat);
