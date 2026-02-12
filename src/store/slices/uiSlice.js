import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    limitReached: {
        isOpen: false,
        data: null
    },
    sidebarLocked: localStorage.getItem("sidebarLocked") === "false" ? false : true // Default true, persist
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
        },
        toggleSidebarLock: (state) => {
            state.sidebarLocked = !state.sidebarLocked;
            localStorage.setItem("sidebarLocked", state.sidebarLocked);
        }
    }
});

export const { showLimitModal, hideLimitModal, toggleSidebarLock } = uiSlice.actions;
export default uiSlice.reducer;
