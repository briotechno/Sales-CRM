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
            transformResponse: (response) => {
                if (!response.success || !response.data) return response;

                const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.VITE_API_BASE_URL.split('/api')[0];

                const prefixUrl = (path) => {
                    if (!path) return null;
                    if (path.startsWith('http') || path.startsWith('data:')) return path;
                    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
                };

                const data = response.data;

                if (data.leaveRequests) {
                    data.leaveRequests = data.leaveRequests.map(req => ({
                        ...req,
                        avatar: prefixUrl(req.avatar)
                    }));
                }

                if (data.recentJoiners) {
                    data.recentJoiners = data.recentJoiners.map(j => ({
                        ...j,
                        avatar: prefixUrl(j.avatar)
                    }));
                }

                if (data.anniversaries) {
                    data.anniversaries = data.anniversaries.map(a => ({
                        ...a,
                        avatar: prefixUrl(a.avatar)
                    }));
                }

                return response;
            },
            providesTags: ['HRMDashboard'],
        }),
    }),
});

export const { useGetHRMDashboardDataQuery } = hrmDashboardApi;
