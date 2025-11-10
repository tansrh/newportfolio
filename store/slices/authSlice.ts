import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface AuthState {
  loggedIn: boolean;
  authToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  loggedIn: false,
  authToken: null,
  refreshToken: null,
};


const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login(state, action: PayloadAction<{ authToken: string; refreshToken: string }>) {
			state.loggedIn = true;
			state.authToken = action.payload.authToken;
			state.refreshToken = action.payload.refreshToken;
		},
		logout(state) {
			state.loggedIn = false;
			state.authToken = null;
			state.refreshToken = null;
		},
		setTokens(state, action: PayloadAction<{ authToken: string; refreshToken: string }>) {
			state.authToken = action.payload.authToken;
			state.refreshToken = action.payload.refreshToken;
		},
		hydrate(state, action: PayloadAction<Partial<AuthState>>) {
			Object.assign(state, action.payload);
		},
	},
});

export const { login, logout, setTokens, hydrate } = authSlice.actions;
export default authSlice.reducer;
