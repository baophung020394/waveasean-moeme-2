import {
  fetchChannels,
  fetchUnreads,
  setNotification,
  setCurrentChannel,
  subscribeNotificationToMessages,
  registerMessageSubscription,
  getNotifications,
} from "actions/channel";
import LoadingView from "components/Spinner/LoadingView";
import Title from "components/Title";
import { Channel } from "models/channel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import db, { Timestamp } from "db/firestore";

import CardChannelList from "components/CardChannelList";
import { createTimestamp } from "utils/time";
import "firebase/compat/firestore";
import firebase from "firebase/compat/app";
import "firebase/database";
import { Notification } from "components/Notifications";

interface ChannelListProps {}

function ChannelList({}: ChannelListProps) {
  const [channel, setChannel] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const dispatch: any = useDispatch();
  const isChecking = useSelector(({ channel }) => channel.isChecking);
  const user = useSelector(({ auth }) => auth.user);
  const currentChannel = useSelector(({ channel }) => channel.currentChannel);

  const notificationsChnl = useSelector(({ channel }) => channel.notifications);
  const messageSubsNotifications = useSelector(
    ({ channel }) => channel.messageSubsNotifications
  );

  const [channelsState, setChannelsState] = useState([]);

  // const setFirstChannel = () => {
  //   const firstChannel = joinedChannels[0];
  //   if (firstLoad && joinedChannels.length > 0) {
  //     setChannel(firstChannel);
  //     dispatch(setCurrentChannel(firstChannel));
  //   }
  //   setFirstLoad(false);
  // };

  const channelsRef = firebase.database().ref("channels");

  useEffect(() => {
    channelsRef.on("child_added", (snap) => {
      setChannelsState((currentState) => {
        let updatedState = [...currentState];
        updatedState.push(snap.val());
        return updatedState;
      });
    });

    return () => channelsRef.off();
  }, []);

  console.log({ channelsState });
  useEffect(() => {
    if (channelsState.length > 0) {
      dispatch(setCurrentChannel(channelsState[0]));
      // localStorage.setItem("urlCopy", "");
      // localStorage.setItem("selectedChannel", "");
    }
  }, [!currentChannel ? channelsState : null]);

  useEffect(() => {
    if (
      localStorage.getItem("_user")?.length &&
      localStorage.getItem("urlCopy")?.length > 0 &&
      localStorage.getItem("selectedChannel")?.length > 0
    ) {
      dispatch(
        setCurrentChannel(JSON.parse(localStorage.getItem("selectedChannel")))
      );
      // localStorage.setItem("urlCopy", "");
      // localStorage.setItem("selectedChannel", "");
      return;
    }
  }, [
    localStorage.getItem("selectedChannel")?.length &&
      localStorage.getItem("urlCopy")?.length,
    localStorage.getItem("_user")?.length,
  ]);
  // || !localStorage.getItem("selectedChannel").length
  if (isChecking) {
    return <LoadingView message="Load channels...." />;
  }

  return (
    <ChannelListStyled className="channel-list">
      <Title name="Channels joined" />
      <div className="card--container">
        {channelsState?.length > 0 &&
          channelsState
            ?.filter((cn: any) => cn?.room_name || cn?.id !== undefined)
            .map((channel: Channel, index: number) => {
              return (
                <CardChannelList
                  channel={channel}
                  key={`${channel?.room_name}-${index}`}
                  setChannel={setChannel}
                />
              );
            })}
      </div>
    </ChannelListStyled>
  );
}

const ChannelListStyled = styled.div`
  height: 100%;

  .card--container {
    padding: 10px;
    height: calc(100% - 91px);
    overflow-y: auto;

    /* width */
    &::-webkit-scrollbar {
      width: 8px;
      display: none;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 20px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    &:hover {
      &::-webkit-scrollbar {
        display: unset;
      }
    }
  }
`;
export default ChannelList;
