import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { authApi } from './api/authApi';
import { businessApi } from './api/businessApi';
import { departmentApi } from './api/departmentApi';
import { designationApi } from './api/designationApi';
import { employeeApi } from './api/employeeApi';
import { teamApi } from './api/teamApi';
import { leaveApi } from './api/leaveApi';
import { jobApi } from './api/jobApi';
import { companyPolicyApi } from './api/companyPolicyApi';
import { hrPolicyApi } from './api/hrPolicyApi';
import { termApi } from './api/termApi';
import { hrmDashboardApi } from './api/hrmDashboardApi';
import { salaryApi } from './api/salaryApi';
import { userApi } from './api/userApi';
import { catalogApi } from './api/catalogApi';
import { catalogCategoryApi } from './api/catalogCategoryApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [businessApi.reducerPath]: businessApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [designationApi.reducerPath]: designationApi.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [teamApi.reducerPath]: teamApi.reducer,
        [leaveApi.reducerPath]: leaveApi.reducer,
        [jobApi.reducerPath]: jobApi.reducer,
        [companyPolicyApi.reducerPath]: companyPolicyApi.reducer,
        [hrPolicyApi.reducerPath]: hrPolicyApi.reducer,
        [termApi.reducerPath]: termApi.reducer,
        [hrmDashboardApi.reducerPath]: hrmDashboardApi.reducer,
        [salaryApi.reducerPath]: salaryApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [catalogApi.reducerPath]: catalogApi.reducer,
        [catalogCategoryApi.reducerPath]: catalogCategoryApi.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            businessApi.middleware,
            departmentApi.middleware,
            designationApi.middleware,
            employeeApi.middleware,
            teamApi.middleware,
            leaveApi.middleware,
            jobApi.middleware,
            companyPolicyApi.middleware,
            hrPolicyApi.middleware,
            termApi.middleware,
            hrmDashboardApi.middleware,
            salaryApi.middleware,
            userApi.middleware,
            catalogApi.middleware,
            catalogCategoryApi.middleware
        ),
});
