import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const invoiceApi = createApi({
    reducerPath: 'invoiceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Invoice'],
    endpoints: (builder) => ({
        getInvoices: builder.query({
            query: (params) => ({
                url: 'invoices',
                params: {
                    status: params?.status && params.status !== 'all' ? params.status : undefined,
                    search: params?.search || undefined,
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    dateFrom: params?.dateFrom || undefined,
                    dateTo: params?.dateTo || undefined,
                    customer_type: params?.customer_type && params.customer_type !== 'all' ? params.customer_type : undefined,
                    tax_type: params?.tax_type && params.tax_type !== 'all' ? params.tax_type : undefined,
                },
            }),
            providesTags: ['Invoice'],
        }),
        getInvoiceById: builder.query({
            query: (id) => `invoices/${id}`,
            providesTags: (result, error, id) => [{ type: 'Invoice', id }],
        }),
        createInvoice: builder.mutation({
            query: (data) => ({
                url: 'invoices',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Invoice'],
        }),
        updateInvoice: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `invoices/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Invoice', { type: 'Invoice', id }],
        }),
        deleteInvoice: builder.mutation({
            query: (id) => ({
                url: `invoices/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Invoice'],
        }),
    }),
});

export const {
    useGetInvoicesQuery,
    useGetInvoiceByIdQuery,
    useCreateInvoiceMutation,
    useUpdateInvoiceMutation,
    useDeleteInvoiceMutation,
} = invoiceApi;
