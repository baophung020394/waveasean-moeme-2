import {
  createErrorReducer,
  createIsFetchingReducer,
  logoutReducer,
} from "reducers/common";
import { combineReducers } from "redux";

const createLoginReducer = () =>
  combineReducers({
    isChecking: createIsFetchingReducer("AUTH_LOGIN"),
    error: createErrorReducer("AUTH_LOGIN"),
  });

const createRegisterReducer = () =>
  combineReducers({
    isChecking: createIsFetchingReducer("AUTH_REGISTER"),
    error: createErrorReducer("AUTH_REGISTER"),
  });

function createAuthReducer() {
  const user = (state: any = null, action: any) => {
    switch (action.type) {
      case "AUTH_ON_ERROR":
      case "AUTH_ON_INIT":
        return null;
      case "AUTH_LOGIN_FIREBASE_SUCCESS":
      case "AUTH_LOGIN_SUCCESS":
      case "AUTH_REGISTER_SUCCESS":
      case "AUTH_ON_SUCCESS":
        return action.user;
      default:
        return state;
    }
  };

  const logout = (state: any = null, action: any) => {
    switch (action.type) {
      case "AUTH_LOGOUT_SUCCESS":
        return {
          user: null,
        };
      default:
        return state;
    }
  };

  return combineReducers({
    user,
    logout,
    isChecking: createIsFetchingReducer("AUTH_ON"),
    login: createLoginReducer(),
    register: createRegisterReducer(),
  });
}

export default createAuthReducer();
