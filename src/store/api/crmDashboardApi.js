import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const crmDashboardApi = createApi({
    reducerPath: 'crmDashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}crm-dashboard`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCRMStats: builder.query({
            query: () => '/stats',
        }),
    }),
});

export const { useGetCRMStatsQuery } = crmDashboardApi;
