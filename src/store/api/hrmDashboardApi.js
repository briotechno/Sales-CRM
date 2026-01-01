import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hrmDashboardApi = createApi({
    reducerPath: 'hrmDashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['HRMDashboard'],
    endpoints: (builder) => ({
        getHRMDashboardData: builder.query({
            query: () => 'hrm-dashboard',
            providesTags: ['HRMDashboard'],
        }),
    }),
});

export const { useGetHRMDashboardDataQuery } = hrmDashboardApi;
