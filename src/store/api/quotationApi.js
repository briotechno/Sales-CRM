import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quotationApi = createApi({
    reducerPath: 'quotationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/', // Verify this matches your backend URL
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Quotation'],
    endpoints: (builder) => ({
        getQuotations: builder.query({
            query: (params) => ({
                url: 'quotations',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    status: params?.status !== 'All' ? params?.status : undefined,
                    search: params?.search || undefined,
                },
            }),
            providesTags: ['Quotation'],
        }),
        getQuotationById: builder.query({
            query: (id) => `quotations/${id}`,
            providesTags: (result, error, id) => [{ type: 'Quotation', id }],
        }),
        createQuotation: builder.mutation({
            query: (data) => ({
                url: 'quotations',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Quotation'],
        }),
        updateQuotation: builder.mutation({
            query: ({ id, data }) => ({
                url: `quotations/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Quotation', { type: 'Quotation', id }],
        }),
        deleteQuotation: builder.mutation({
            query: (id) => ({
                url: `quotations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Quotation'],
        }),
    }),
});

export const {
    useGetQuotationsQuery,
    useGetQuotationByIdQuery,
    useLazyGetQuotationByIdQuery,
    useCreateQuotationMutation,
    useUpdateQuotationMutation,
    useDeleteQuotationMutation,
} = quotationApi;
