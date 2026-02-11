import reduxStorage from "@/utils/redux-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import { accountSetupState } from "./slices/account-setup-reducer";
import otpPageReducer from "./slices/otp.reducer";
import { tokenState } from "./slices/token.reducer";
import { userState } from "./slices/user.reducer";

const persistConfig = {
  key: "root",
  storage: reduxStorage,
  whitelist: ["token", "user"],
};

const rootReducer = combineReducers({
  otpPage: otpPageReducer,
  token: tokenState.reducer,
  user: userState.reducer,
  accountSetup: accountSetupState.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
