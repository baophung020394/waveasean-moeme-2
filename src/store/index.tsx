import authReducer from "reducers/auth";
import channelReducer from "reducers/channel";
import chatReducer from "reducers/chat";
import appReducer from "reducers/app";
import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import appMiddleware from "./middlewares/app";

export default function configureStore() {
  const middlewares = [thunkMiddleware, appMiddleware];

  const mainReducer = combineReducers({
    channel: channelReducer,
    auth: authReducer,
    app: appReducer,
    chat: chatReducer,
  });

  const rootReducer = (state: any, action: any) => {
    if (action.type === "AUTH_LOGOUT_SUCCESS") {
      state = undefined;
    }

    return mainReducer(state, action);
  };

  const store = createStore(
    rootReducer,
    applyMiddleware(...middlewares, logger)
  );

  return store;
}
