import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const teamApi = createApi({
    reducerPath: 'teamApi',
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
    tagTypes: ['Team'],
    endpoints: (builder) => ({
        getTeams: builder.query({
            query: ({ page = 1, limit = 10, search = '' }) => ({
                url: `teams?page=${page}&limit=${limit}&search=${search}`,
                method: 'GET',
            }),
            providesTags: ['Team'],
        }),
        getTeamById: builder.query({
            query: (id) => `teams/${id}`,
            providesTags: (result, error, id) => [{ type: 'Team', id }],
        }),
        createTeam: builder.mutation({
            query: (newTeam) => ({
                url: 'teams',
                method: 'POST',
                body: newTeam,
            }),
            invalidatesTags: ['Team'],
        }),
        updateTeam: builder.mutation({
            query: ({ id, ...updatedTeam }) => ({
                url: `teams/${id}`,
                method: 'PUT',
                body: updatedTeam,
            }),
            invalidatesTags: (result, error, { id }) => ['Team', { type: 'Team', id }],
        }),
        deleteTeam: builder.mutation({
            query: (id) => ({
                url: `teams/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Team'],
        }),
    }),
});

export const {
    useGetTeamsQuery,
    useGetTeamByIdQuery,
    useCreateTeamMutation,
    useUpdateTeamMutation,
    useDeleteTeamMutation,
} = teamApi;
