import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { businessApi } from './api/businessApi';
import { departmentApi } from './api/departmentApi';
import { designationApi } from './api/designationApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [businessApi.reducerPath]: businessApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [designationApi.reducerPath]: designationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            businessApi.middleware,
            departmentApi.middleware,
            designationApi.middleware
        ),
});
