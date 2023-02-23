import React from "react";
import { Provider } from "react-redux";
import configureStore from "store/index";

const store: any = configureStore();

export default function StoreProvider({ children }: any) {
  return <Provider store={store}>{children}</Provider>;
}
