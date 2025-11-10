import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  editMode: false,
};

const editModeSlice = createSlice({
  name: 'editMode',
  initialState,
  reducers: {
    setEditMode(state, action) {
      state.editMode = action.payload;
    },
    toggleEditMode(state) {
      state.editMode = !state.editMode;
    },
  },
});

export const { setEditMode, toggleEditMode } = editModeSlice.actions;
export default editModeSlice.reducer;
