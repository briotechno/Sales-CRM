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
