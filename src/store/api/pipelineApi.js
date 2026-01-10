import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pipelineApi = createApi({
    reducerPath: 'pipelineApi',
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
    tagTypes: ['Pipeline', 'PipelineStage'],
    endpoints: (builder) => ({
        getPipelines: builder.query({
            query: () => 'pipelines',
            providesTags: ['Pipeline'],
        }),
        getPipelineById: builder.query({
            query: (id) => `pipelines/${id}`,
            providesTags: (result, error, id) => [{ type: 'Pipeline', id }],
        }),
        createPipeline: builder.mutation({
            query: (data) => ({
                url: 'pipelines',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Pipeline'],
        }),
        updatePipeline: builder.mutation({
            query: ({ id, data }) => ({
                url: `pipelines/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Pipeline', { type: 'Pipeline', id }],
        }),
        deletePipeline: builder.mutation({
            query: (id) => ({
                url: `pipelines/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Pipeline'],
        }),
        // Stages
        addPipelineStage: builder.mutation({
            query: (data) => ({
                url: 'pipeline-stages',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Pipeline'],
        }),
        updatePipelineStage: builder.mutation({
            query: ({ id, data }) => ({
                url: `pipeline-stages/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Pipeline'],
        }),
        deletePipelineStage: builder.mutation({
            query: (id) => ({
                url: `pipeline-stages/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Pipeline'],
        }),
    }),
});

export const {
    useGetPipelinesQuery,
    useGetPipelineByIdQuery,
    useCreatePipelineMutation,
    useUpdatePipelineMutation,
    useDeletePipelineMutation,
    useAddPipelineStageMutation,
    useUpdatePipelineStageMutation,
    useDeletePipelineStageMutation,
} = pipelineApi;
