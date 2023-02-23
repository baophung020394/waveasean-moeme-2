import { User } from "models/user";

export const getAccessToken = () => {
  const _user = JSON.parse(localStorage.getItem("_user"));
  return _user?.accessToken;
};

export const setUser = (user: any) => {
  console.log("user ne may be", user);

  const accessToken = user?.atk;
  const refreshToken = user?.rtk;
  const userId = user?.uid;
  const _user = {
    accessToken,
    refreshToken,
    userId,
  };
  localStorage.setItem("_user", JSON.stringify(_user));
  localStorage.setItem("_profile", JSON.stringify(user));
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("_user"));
};

export const getLocalRefreshToken = () => {
  const _user = JSON.parse(localStorage.getItem("_user"));
  return _user?.refreshToken;
};

export const updateLocalAccessToken = (token: string) => {
  localStorage.setItem("_user", JSON.stringify(token));
};

export const removeUser = () => {
  localStorage.removeItem("_user");
};
