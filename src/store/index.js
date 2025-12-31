import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { businessApi } from './api/businessApi';
import { departmentApi } from './api/departmentApi';
import { designationApi } from './api/designationApi';
import { employeeApi } from './api/employeeApi';
import { teamApi } from './api/teamApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [businessApi.reducerPath]: businessApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [designationApi.reducerPath]: designationApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [teamApi.reducerPath]: teamApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            businessApi.middleware,
            departmentApi.middleware,
            designationApi.middleware,
            employeeApi.middleware,
            teamApi.middleware
        ),
});
