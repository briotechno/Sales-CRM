import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const companyPolicyApi = createApi({
    reducerPath: 'companyPolicyApi',
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
    tagTypes: ['CompanyPolicy'],
    endpoints: (builder) => ({
        getCompanyPolicies: builder.query({
            query: ({ category, status, search, author, startDate, endDate }) => {
                let url = 'company-policies';
                const params = new URLSearchParams();
                if (category && category !== 'All') params.append('category', category);
                if (status && status !== 'All') params.append('status', status);
                if (search) params.append('search', search);
                if (author) params.append('author', author);
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                const queryString = params.toString();
                return queryString ? `${url}?${queryString}` : url;
            },
            providesTags: ['CompanyPolicy'],
        }),
        getCompanyPolicyById: builder.query({
            query: (id) => `company-policies/${id}`,
            providesTags: (result, error, id) => [{ type: 'CompanyPolicy', id }],
        }),
        createCompanyPolicy: builder.mutation({
            query: (newPolicy) => ({
                url: 'company-policies',
                method: 'POST',
                body: newPolicy,
            }),
            invalidatesTags: ['CompanyPolicy'],
        }),
        updateCompanyPolicy: builder.mutation({
            query: ({ id, ...updates }) => ({
                url: `company-policies/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: ['CompanyPolicy'],
        }),
        deleteCompanyPolicy: builder.mutation({
            query: (id) => ({
                url: `company-policies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CompanyPolicy'],
        }),
    }),
});

export const {
    useGetCompanyPoliciesQuery,
    useGetCompanyPolicyByIdQuery,
    useCreateCompanyPolicyMutation,
    useUpdateCompanyPolicyMutation,
    useDeleteCompanyPolicyMutation,
} = companyPolicyApi;
