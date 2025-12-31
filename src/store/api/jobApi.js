import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jobApi = createApi({
    reducerPath: 'jobApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Job'],
    endpoints: (builder) => ({
        getJobs: builder.query({
            query: ({ page = 1, limit = 10, search = '', status = 'All' }) => {
                let url = `jobs?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                if (status !== 'All') url += `&status=${status}`;
                return url;
            },
            providesTags: ['Job'],
        }),
        getJobStats: builder.query({
            query: () => 'jobs/stats',
            providesTags: ['Job'],
        }),
        createJob: builder.mutation({
            query: (newJob) => ({
                url: 'jobs',
                method: 'POST',
                body: newJob,
            }),
            invalidatesTags: ['Job'],
        }),
        updateJob: builder.mutation({
            query: ({ id, ...updatedJob }) => ({
                url: `jobs/${id}`,
                method: 'PUT',
                body: updatedJob,
            }),
            invalidatesTags: ['Job'],
        }),
        deleteJob: builder.mutation({
            query: (id) => ({
                url: `jobs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Job'],
        }),
    }),
});

export const {
    useGetJobsQuery,
    useGetJobStatsQuery,
    useCreateJobMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
} = jobApi;
