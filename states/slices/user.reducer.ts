import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  _id: string;
  accountType: string;
  createdAt: string;
  deleted: boolean;
  email: string;
  firstName: string;
  isDeleted: boolean;
  isEmailVerified: boolean;
  lastName: string;
  status: string;
  updatedAt: string;
}

const initialState: UserState = {
  email: "",
  _id: "",
  accountType: "",
  createdAt: "",
  deleted: false,
  firstName: "",
  isDeleted: false,
  isEmailVerified: false,
  lastName: "",
  status: "",
  updatedAt: "",
};

export const userState = createSlice({
  name: "User",
  initialState,
  reducers: {
    updateDetails: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateDetails } = userState.actions;

export default userState.reducer;
