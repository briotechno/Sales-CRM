import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const catalogCategoryApi = createApi({
    reducerPath: 'catalogCategoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/catalog-categories',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['CatalogCategory'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (params) => ({
                url: '/',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 100, // Usually categories are fewer, so default to 100 for dropdowns
                    status: params?.status,
                    search: params?.search,
                }
            }),
            providesTags: ['CatalogCategory'],
        }),
        getCategoryById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'CatalogCategory', id }],
        }),
        createCategory: builder.mutation({
            query: (newCategory) => ({
                url: '/',
                method: 'POST',
                body: newCategory,
            }),
            invalidatesTags: ['CatalogCategory'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['CatalogCategory', { type: 'CatalogCategory', id }],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CatalogCategory'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = catalogCategoryApi;
