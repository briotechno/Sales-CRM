import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const expenseApi = createApi({
    reducerPath: 'expenseApi',
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
    tagTypes: ['Expense', 'HrmDashboard'],
    endpoints: (builder) => ({
        getExpenses: builder.query({
            query: (params) => ({
                url: 'expenses',
                params,
            }),
            providesTags: ['Expense'],
            transformResponse: (response) => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
                if (response.expenses) {
                    response.expenses = response.expenses.map(exp => ({
                        ...exp,
                        receipt_full_url: exp.receipt_url ? `${baseUrl}/${exp.receipt_url}` : null
                    }));
                }
                return response;
            }
        }),
        getExpenseById: builder.query({
            query: (id) => `expenses/${id}`,
            providesTags: (result, error, id) => [{ type: 'Expense', id }],
        }),
        addExpense: builder.mutation({
            query: (newItem) => ({
                url: 'expenses',
                method: 'POST',
                body: newItem,
            }),
            invalidatesTags: ['Expense', 'HrmDashboard'],
        }),
        updateExpense: builder.mutation({
            query: ({ id, data }) => ({
                url: `expenses/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Expense', id }, 'Expense', 'HrmDashboard'],
        }),
        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `expenses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Expense', 'HrmDashboard'],
        }),
    }),
});

export const {
    useGetExpensesQuery,
    useGetExpenseByIdQuery,
    useAddExpenseMutation,
    useUpdateExpenseMutation,
    useDeleteExpenseMutation,
} = expenseApi;
