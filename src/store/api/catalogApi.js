import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const catalogApi = createApi({
    reducerPath: 'catalogApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/catalogs',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Catalog'],
    endpoints: (builder) => ({
        getCatalogs: builder.query({
            query: (params) => ({
                url: '/',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    status: params?.status,
                    search: params?.search,
                }
            }),
            providesTags: ['Catalog'],
        }),
        getCatalogById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Catalog', id }],
        }),
        createCatalog: builder.mutation({
            query: (newCatalog) => ({
                url: '/',
                method: 'POST',
                body: newCatalog,
            }),
            invalidatesTags: ['Catalog'],
        }),
        updateCatalog: builder.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Catalog', { type: 'Catalog', id }],
        }),
        deleteCatalog: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Catalog'],
        }),
    }),
});

export const {
    useGetCatalogsQuery,
    useGetCatalogByIdQuery,
    useCreateCatalogMutation,
    useUpdateCatalogMutation,
    useDeleteCatalogMutation,
} = catalogApi;
