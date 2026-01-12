import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface TokenState {
  token: string | null;
}

const initialState: TokenState = {
  token: null,
};

export const tokenState = createSlice({
  name: "Token",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    reset: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, reset } = tokenState.actions;

export default tokenState.reducer;
