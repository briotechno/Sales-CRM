import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const hrPolicyApi = createApi({
    reducerPath: 'hrPolicyApi',
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
    tagTypes: ['HRPolicy'],
    endpoints: (builder) => ({
        getHRPolicies: builder.query({
            query: ({ category, status, search, department, startDate, endDate }) => {
                let url = 'hr-policies';
                const params = new URLSearchParams();
                if (category && category !== 'All') params.append('category', category);
                if (status && status !== 'All') params.append('status', status);
                if (search) params.append('search', search);
                if (department && department !== 'All') params.append('department', department);
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);
                const queryString = params.toString();
                return queryString ? `${url}?${queryString}` : url;
            },
            providesTags: ['HRPolicy'],
        }),
        getHRPolicyById: builder.query({
            query: (id) => `hr-policies/${id}`,
            providesTags: (result, error, id) => [{ type: 'HRPolicy', id }],
        }),
        createHRPolicy: builder.mutation({
            query: (newPolicy) => ({
                url: 'hr-policies',
                method: 'POST',
                body: newPolicy,
            }),
            invalidatesTags: ['HRPolicy'],
        }),
        updateHRPolicy: builder.mutation({
            query: ({ id, formData }) => ({
                url: `hr-policies/${id}`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['HRPolicy'],
        }),
        deleteHRPolicy: builder.mutation({
            query: (id) => ({
                url: `hr-policies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['HRPolicy'],
        }),
    }),
});

export const {
    useGetHRPoliciesQuery,
    useGetHRPolicyByIdQuery,
    useCreateHRPolicyMutation,
    useUpdateHRPolicyMutation,
    useDeleteHRPolicyMutation,
} = hrPolicyApi;
