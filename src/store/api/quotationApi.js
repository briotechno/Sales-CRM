import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const quotationApi = createApi({
    reducerPath: 'quotationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL, // Verify this matches your backend URL
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Quotation', 'Client'],
    endpoints: (builder) => ({
        getQuotations: builder.query({
            query: (params) => ({
                url: 'quotations',
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    status: params?.status && params.status !== 'all' ? params.status : undefined,
                    search: params?.search || undefined,
                    dateFrom: params?.dateFrom || undefined,
                    dateTo: params?.dateTo || undefined,
                    customer_type: params?.customer_type && params.customer_type !== 'all' ? params.customer_type : undefined,
                    tax_type: params?.tax_type && params.tax_type !== 'all' ? params.tax_type : undefined,
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
            // Invalidate both Quotation and Client tags since creating a quotation can auto-create a client
            invalidatesTags: ['Quotation', 'Client'],
        }),
        updateQuotation: builder.mutation({
            query: ({ id, data }) => ({
                url: `quotations/${id}`,
                method: 'PUT',
                body: data,
            }),
            // Invalidate both Quotation and Client tags
            invalidatesTags: (result, error, { id }) => ['Quotation', { type: 'Quotation', id }, 'Client'],
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
