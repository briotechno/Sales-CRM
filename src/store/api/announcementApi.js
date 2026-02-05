import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const announcementApi = createApi({
    reducerPath: 'announcementApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}announcements`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Announcement'],
    endpoints: (builder) => ({
        getAnnouncements: builder.query({
            query: (params) => ({
                url: '/',
                params,
            }),
            transformResponse: (response) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
                return {
                    ...response,
                    announcements: response.announcements.map(announcement => ({
                        ...announcement,
                        author_profile_picture_url: announcement.author_profile_picture
                            ? `${baseUrl}${announcement.author_profile_picture}`
                            : null
                    }))
                };
            },
            providesTags: ['Announcement'],
        }),
        createAnnouncement: builder.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Announcement'],
        }),
        updateAnnouncement: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Announcement'],
        }),
        deleteAnnouncement: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Announcement'],
        }),
    }),
});

export const {
    useGetAnnouncementsQuery,
    useCreateAnnouncementMutation,
    useUpdateAnnouncementMutation,
    useDeleteAnnouncementMutation,
} = announcementApi;
