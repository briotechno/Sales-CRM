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
            query: (period = '6m') => `/stats?period=${period}`,
            transformResponse: (response) => {
                if (!response.success) return response;

                const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.VITE_API_BASE_URL.split('/api')[0];

                const prefixUrl = (path) => {
                    if (!path) return null;
                    if (path.startsWith('http') || path.startsWith('data:')) return path;
                    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
                };

                if (response.recentLeads) {
                    response.recentLeads = response.recentLeads.map(l => ({
                        ...l,
                        profile_picture: prefixUrl(l.profile_picture)
                    }));
                }

                if (response.champions) {
                    response.champions = response.champions.map(c => ({
                        ...c,
                        avatar_url: prefixUrl(c.avatar_url)
                    }));
                }

                if (response.teamPerformance) {
                    response.teamPerformance = response.teamPerformance.map(t => ({
                        ...t,
                        avatar_url: prefixUrl(t.avatar_url)
                    }));
                }

                if (response.activityFeed) {
                    response.activityFeed = response.activityFeed.map(a => ({
                        ...a,
                        avatar_url: prefixUrl(a.avatar_url)
                    }));
                }

                if (response.workloadData) {
                    response.workloadData = response.workloadData.map(w => ({
                        ...w,
                        avatar: prefixUrl(w.avatar)
                    }));
                }

                return response;
            }
        }),
    }),
});

export const { useGetCRMStatsQuery } = crmDashboardApi;
