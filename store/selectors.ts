import { RootState } from './rootStore';

export const selectEditMode = (state: RootState) => state.editMode.editMode && state.auth.loggedIn;
