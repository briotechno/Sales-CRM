import { isRejectedWithValue } from '@reduxjs/toolkit';
import { showLimitModal } from '../slices/uiSlice';

/**
 * Middleware to catch 402 (Payment Required) or custom limit errors
 * and trigger the global UpgradePlanModal.
 */
export const limitErrorMiddleware = (api) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const status = action.payload?.status;
        const data = action.payload?.data;

        // Trigger on 402 status OR if limitReached flag is in the response body
        if (status === 402 || data?.limitReached) {
            api.dispatch(showLimitModal(data || action.payload));
        }
    }

    return next(action);
};
