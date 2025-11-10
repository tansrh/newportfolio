import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
    isOpen: boolean;
    content: string | null;
    props?: any;
}

const initialState: ModalState = {
    isOpen: false,
    content: null
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.content = action.payload.content;
            state.props = action.payload.props;
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.content = null;
            state.props = undefined;
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
