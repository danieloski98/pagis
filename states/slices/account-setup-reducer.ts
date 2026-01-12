import { IPlan } from "@/modules/types/PlansType";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface OtpPageState {
  accountType: "BUSINESS" | "PERSONAL" | null;
  category: string;
  currentPage: number;
  paymentId: null | string;
  selectedPlan: null | IPlan;
  firstName: string | null;
  lastName: string | null;
}

const initialState: OtpPageState = {
  accountType: null,
  category: "",
  currentPage: 1,
  paymentId: null,
  selectedPlan: null,
  firstName: null,
  lastName: null,
};

export const accountSetupState = createSlice({
  name: "AccountSetup",
  initialState,
  reducers: {
    setAccountType: (
      state,
      action: PayloadAction<"BUSINESS" | "PERSONAL" | null>
    ) => {
      state.accountType = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPaymentId: (state, action: PayloadAction<null | string>) => {
      state.paymentId = action.payload;
    },
    setSelectedPlan: (state, action: PayloadAction<null | IPlan>) => {
      state.selectedPlan = action.payload;
    },
    setName: (
      state,
      action: PayloadAction<{ firstName: string; lastName: string }>
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
  },
});

export const {
  setAccountType,
  setCategory,
  setCurrentPage,
  setPaymentId,
  setSelectedPlan,
  setName,
} = accountSetupState.actions;

export default accountSetupState.reducer;
