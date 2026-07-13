import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import catalogReducer from "./slices/catalogSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  catalog: catalogReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
