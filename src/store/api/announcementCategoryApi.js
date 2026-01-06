import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const announcementCategoryApi = createApi({
    reducerPath: 'announcementCategoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}announcement-categories`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['AnnouncementCategory'],
    endpoints: (builder) => ({
        getAnnouncementCategories: builder.query({
            query: (params) => ({
                url: '/',
                params,
            }),
            providesTags: ['AnnouncementCategory'],
        }),
        createAnnouncementCategory: builder.mutation({
            query: (data) => ({
                url: '/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['AnnouncementCategory'],
        }),
        updateAnnouncementCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['AnnouncementCategory'],
        }),
        deleteAnnouncementCategory: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AnnouncementCategory'],
        }),
    }),
});

export const {
    useGetAnnouncementCategoriesQuery,
    useCreateAnnouncementCategoryMutation,
    useUpdateAnnouncementCategoryMutation,
    useDeleteAnnouncementCategoryMutation,
} = announcementCategoryApi;
