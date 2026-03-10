import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const superAdminApi = createApi({
    reducerPath: 'superAdminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}super-admin`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['SuperAdminDashboard'],
    endpoints: (builder) => ({
        getSuperAdminDashboardStats: builder.query({
            query: (period) => `/dashboard-stats?period=${period || ''}`,
            providesTags: ['SuperAdminDashboard'],
        }),
        getEnterpriseGrowth: builder.query({
            query: (period) => `/enterprise-growth?period=${period || ''}`,
            providesTags: ['SuperAdminDashboard'],
        }),
        getRevenueAnalytics: builder.query({
            query: (period) => `/revenue-analytics?period=${period || ''}`,
            providesTags: ['SuperAdminDashboard'],
        }),
        getSubscriptionDistribution: builder.query({
            query: (period) => `/subscription-distribution?period=${period || ''}`,
            providesTags: ['SuperAdminDashboard'],
        }),
        getUpgradeDowngradeTrends: builder.query({
            query: (period) => `/upgrade-downgrade-trends?period=${period || ''}`,
            providesTags: ['SuperAdminDashboard'],
        }),
        getProductKeyStats: builder.query({
            query: (period) => `/product-key-stats?period=${period || ''}`,
            providesTags: ['SuperAdminDashboard'],
        }),
        getChurnAlerts: builder.query({
            query: () => '/churn-alerts',
            providesTags: ['SuperAdminDashboard'],
        }),
        getRecentEnterprises: builder.query({
            query: () => '/recent-enterprises',
            providesTags: ['SuperAdminDashboard'],
        }),
        getUsageStats: builder.query({
            query: (period) => `/usage-stats?period=${period || ''}`,
            providesTags: ['SuperAdminDashboard'],
        }),
    }),
});

export const {
    useGetSuperAdminDashboardStatsQuery,
    useGetEnterpriseGrowthQuery,
    useGetRevenueAnalyticsQuery,
    useGetSubscriptionDistributionQuery,
    useGetUpgradeDowngradeTrendsQuery,
    useGetProductKeyStatsQuery,
    useGetChurnAlertsQuery,
    useGetRecentEnterprisesQuery,
    useGetUsageStatsQuery,
} = superAdminApi;
