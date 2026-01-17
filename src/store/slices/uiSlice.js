import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    limitReached: {
        isOpen: false,
        data: null
    }
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showLimitModal: (state, action) => {
            state.limitReached.isOpen = true;
            state.limitReached.data = action.payload;
        },
        hideLimitModal: (state) => {
            state.limitReached.isOpen = false;
            state.limitReached.data = null;
        }
    }
});

export const { showLimitModal, hideLimitModal } = uiSlice.actions;
export default uiSlice.reducer;
