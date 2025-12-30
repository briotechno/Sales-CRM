import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const designationApi = createApi({
    reducerPath: 'designationApi',
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
    tagTypes: ['Designation'],
    endpoints: (builder) => ({
        getDesignations: builder.query({
            query: ({ page = 1, limit = 10, status = 'All', search = '' }) => {
                let url = `designations?page=${page}&limit=${limit}`;
                if (status !== 'All') {
                    url += `&status=${status}`;
                }
                if (search) {
                    url += `&search=${search}`;
                }
                return url;
            },
            transformResponse: (response) => {
                if (response.designations) {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
                    response.designations = response.designations.map(dsg => ({
                        ...dsg,
                        image_url: dsg.image ? `${baseUrl}${dsg.image}` : null
                    }));
                }
                return response;
            },
            providesTags: ['Designation'],
        }),
        getDesignationById: builder.query({
            query: (id) => `designations/${id}`,
            transformResponse: (response) => {
                if (response.status && response.data) {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
                    response.data.image_url = response.data.image ? `${baseUrl}${response.data.image}` : null;
                }
                return response;
            },
            providesTags: (result, error, id) => [{ type: 'Designation', id }],
        }),
        createDesignation: builder.mutation({
            query: (newDesignation) => ({
                url: 'designations',
                method: 'POST',
                body: newDesignation,
            }),
            invalidatesTags: ['Designation'],
        }),
        updateDesignation: builder.mutation({
            query: ({ id, data }) => ({
                url: `designations/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Designation', { type: 'Designation', id }],
        }),
        deleteDesignation: builder.mutation({
            query: (id) => ({
                url: `designations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Designation'],
        }),
    }),
});

export const {
    useGetDesignationsQuery,
    useGetDesignationByIdQuery,
    useCreateDesignationMutation,
    useUpdateDesignationMutation,
    useDeleteDesignationMutation,
} = designationApi;
