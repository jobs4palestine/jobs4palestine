import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {LoginResponse} from "../api/login.ts";

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<LoginResponse>) {
            state.isLoggedIn = true;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('userType', action.payload.userType);
        },
        logout(state) {
            state.isLoggedIn = false;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
