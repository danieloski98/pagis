import { configureStore } from "@reduxjs/toolkit";
import { accountSetupState } from "./slices/account-setup-reducer";
import otpPageReducer from "./slices/otp.reducer";
import { tokenState } from "./slices/token.reducer";
import { userState } from "./slices/user.reducer";

export const store = configureStore({
  reducer: {
    otpPage: otpPageReducer,
    token: tokenState.reducer,
    user: userState.reducer,
    accountSetup: accountSetupState.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
