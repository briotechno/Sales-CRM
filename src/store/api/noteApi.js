import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const noteApi = createApi({
    reducerPath: 'noteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}notes`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Note'],
    endpoints: (builder) => ({
        getNotes: builder.query({
            query: (params) => ({
                url: '/',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    category: params?.category,
                    search: params?.search,
                }
            }),
            providesTags: ['Note'],
            // Refetch when page changes or category/search changes
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { category, search } = queryArgs;
                return `${endpointName}-${category}-${search}`;
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 1) {
                    return newItems;
                }
                return {
                    ...newItems,
                    notes: [...currentCache.notes, ...newItems.notes]
                };
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getNoteById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Note', id }],
        }),
        createNote: builder.mutation({
            query: (newNote) => ({
                url: '/',
                method: 'POST',
                body: newNote,
            }),
            invalidatesTags: ['Note'],
        }),
        updateNote: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Note', { type: 'Note', id }],
        }),
        deleteNote: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Note'],
        }),
    }),
});

export const {
    useGetNotesQuery,
    useGetNoteByIdQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} = noteApi;
