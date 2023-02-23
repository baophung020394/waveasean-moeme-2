import { Channel } from "models/channel";
import { createIsFetchingReducer } from "reducers/common";
import { combineReducers } from "redux";
import { createReducer } from "@reduxjs/toolkit";

interface initialState {
  channel?: Channel;
}

function createChannelReducer() {
  const joined = (state: any = [], action: any) => {
    switch (action.type) {
      case "CHANNELS_FETCH_RESTART":
        return [];
      case "CHANNELS_FETCH_SUCCESS":
        return action.joined;

      // case "CHANNELS_JOIN_SUCCESS":
      //   return [...state, action.channel];
      default:
        return state;
    }
  };
  const available = (state: any = [], action: any) => {
    switch (action.type) {
      case "CHANNELS_FETCH_RESTART":
        return [];
      case "CHANNELS_FETCH_SUCCESS":
        return action.available;
      // case "CHANNELS_JOIN_SUCCESS":
      //   return state.filter(
      //     (channel: any) => channel.id !== action?.channel?.id
      //   );
      default:
        return state;
    }
  };

  const channelsCompare = (state: any = [], action: any) => {
    switch (action.type) {
      case "CHANNELS_COMPARE_FETCH_SUCCESS":
        return action.channelsCompare;
      default:
        return state;
    }
  };

  const activeChannels = createReducer(
    {},
    {
      CHANNELS_SET_ACTIVE_CHANNEL: (state: any, action) => {
        const { channel } = action;

        state[channel.id] = channel;
      },

      CHANNELS_UPDATE_USER_STATE: (state: any, action) => {
        const { user, channelId } = action;
        const joinedUsers = state[channelId].joinedUsers;
        const index = joinedUsers.findIndex((ju: any) => ju.uid === user.uid);

        if (index < 0) return state;
        if (joinedUsers[index].state === user.state) return state;

        joinedUsers[index].state = user.state;
      },
    }
  );

  const channel = (state: initialState = null, action: any) => {
    switch (action.type) {
      case "AUTH_LOGOUT_SUCCESS":
      case "CHANNEL_ON_ERROR":
      case "CHANNEL_ON_INIT":
        return null;
      case "CHANNEL_ON_SUCCESS":
        return action.channel.params;

      default:
        return state;
    }
  };

  const notificationChnl = (state: initialState = null, action: any) => {
    switch (action.type) {
      case "SET_NOTIFICATIONS":
        return action.notificationChnl;
      default:
        return state;
    }
  };

  const messages = createReducer(
    {},
    {
      CHANNELS_SET_MESSAGES: (state: any, action) => {
        const prevMessage = state[action.channelId] || [];
        state[action.channelId] = [...prevMessage, ...action.messages];
      },
    }
  );

  const messageSubs = (state = {}, action: any) => {
    switch (action.type) {
      case "CHANNELS_REGISTER_MESSAGE_SUB":
        return { ...state, [action.channelId]: action.sub };

      default:
        return state;
    }
  };

  const messageSubsNotifications = (state = {}, action: any) => {
    switch (action.type) {
      case "CHANNELS_REGISTER_MESSAGE_SUB":
        return { ...state, [action.channelId]: action.sub };

      default:
        return state;
    }
  };

  const notifications = (state = {}, action: any) => {
    switch (action.type) {
      case "GET_LIST_NOTIFICATION": {
        console.log("action.id", action);
        return action.notifications;
      }

      default:
        return state;
    }
  };

  const currentChannel = (state = {}, action: any) => {
    switch (action.type) {
      case "SET_CHANNEL_CURRENT":
        return action.channel;
      default:
        return null;
    }
  };

  const isLoading = (state: initialState = null, action: any) => {
    switch (action.type) {
      case "CHANNELS_FETCH_INIT":
      case "CHANNELS_JOIN_INIT":
      case "CHANNELS_CREATE_INIT":
      case "CHANNELS_CREATE_INIT":
        return {
          result: true,
        };
      case "CHANNELS_JOIN_FAIL":
      case "CHANNELS_CREATE_FAIL":
      case "CHANNELS_CREATE_SUCCESS":
      case "CHANNELS_FETCH_SUCCESS":
        return {
          result: false,
          error: action?.error || {},
        };

      default:
        return false;
    }
  };

  return combineReducers({
    joined,
    available,
    activeChannels,
    messages,
    messageSubs,
    channel,
    isLoading: isLoading,
    notificationChnl,
    currentChannel,
    messageSubsNotifications,
    notifications,
    // channelsCompare,
    // channelDetail,
    // isChecking: createIsFetchingReducer("CHANNEL_ON"),
  });
}

export default createChannelReducer();
