import { combineReducers } from "redux";
import { createReducer } from "@reduxjs/toolkit";

interface initialState {
  message?: any;
}

function createChatReducer() {
  const messages = createReducer(
    {},
    {
      CHATS_SET_MESSAGES: (state: any, action: any) => {
        const prevMessage = state[action.chatId] || [];

        state[action.chatId] = [...prevMessage, ...action.messages];
      },
    }
  );

  return combineReducers({
    messages,
  });
}

export default createChatReducer();
