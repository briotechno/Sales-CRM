import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const mainDashboardApi = createApi({
    reducerPath: 'mainDashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}main-dashboard`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['MainDashboard'],
    endpoints: (builder) => ({
        getMainDashboardStats: builder.query({
            query: () => '/stats',
            providesTags: ['MainDashboard'],
        }),
    }),
});

export const { useGetMainDashboardStatsQuery } = mainDashboardApi;
