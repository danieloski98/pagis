import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';


export interface OtpPageState {
    email: string;
}

const initialState: OtpPageState = {
    email: '',
}

export const otpPageState = createSlice({
    name: 'OtpPage',
    initialState,
    reducers: {
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        reset: (state) => {
            state.email = '';
        }
    }
});

export const { setEmail, reset } = otpPageState.actions

export default otpPageState.reducer;
