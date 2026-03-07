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
            transformResponse: (response) => {
                if (!response || !response.success) return response;

                const baseUrl = import.meta.env.VITE_IMAGE_BASE_URL || import.meta.env.VITE_API_BASE_URL.replace('/api/', '').replace('/api/v1', '');

                const data = { ...response };

                if (data.topPerformers) {
                    data.topPerformers = data.topPerformers.map(performer => ({
                        ...performer,
                        avatar: performer.avatar ? (performer.avatar.startsWith('http') ? performer.avatar : `${baseUrl}${performer.avatar.startsWith('/') ? '' : '/'}${performer.avatar}`) : null
                    }));
                }

                if (data.upcomingBirthdays) {
                    data.upcomingBirthdays = data.upcomingBirthdays.map(employee => ({
                        ...employee,
                        avatar: employee.avatar ? (employee.avatar.startsWith('http') ? employee.avatar : `${baseUrl}${employee.avatar.startsWith('/') ? '' : '/'}${employee.avatar}`) : null
                    }));
                }

                if (data.recentLeads) {
                    data.recentLeads = data.recentLeads.map(lead => ({
                        ...lead,
                        profile_picture: lead.profile_picture ? (lead.profile_picture.startsWith('http') ? lead.profile_picture : `${baseUrl}${lead.profile_picture.startsWith('/') ? '' : '/'}${lead.profile_picture}`) : null
                    }));
                }

                return data;
            },
            providesTags: ['MainDashboard'],
        }),
    }),
});

export const { useGetMainDashboardStatsQuery } = mainDashboardApi;
