import { configureStore } from "@reduxjs/toolkit";
import memeReducer from "./memeSlice";
import themeReducer from "./themeSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    memes: memeReducer,
    theme: themeReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
