import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leadApi = createApi({
    reducerPath: 'leadApi',
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
    tagTypes: ['Lead', 'LeadAssignmentSettings', 'LeadAssignmentLogs'],
    endpoints: (builder) => ({
        getLeads: builder.query({
            query: ({
                page = 1, limit = 10, status = 'All', search = '', pipeline_id = '', tag = 'All', type = 'All',
                subview = 'All', priority = 'All', services = 'All', dateFrom = '', dateTo = ''
            }) => {
                let url = `leads?page=${page}&limit=${limit}`;
                if (status && status !== 'All') url += `&status=${status}`;
                if (search) url += `&search=${search}`;
                if (pipeline_id) url += `&pipeline_id=${pipeline_id}`;
                if (tag && tag !== 'All') url += `&tag=${tag}`;
                if (type && type !== 'All') url += `&type=${type}`;
                if (subview && subview !== 'All') url += `&subview=${subview}`;
                if (priority && priority !== 'All') url += `&priority=${priority}`;
                if (services && services !== 'All') url += `&services=${services}`;
                if (dateFrom) url += `&dateFrom=${dateFrom}`;
                if (dateTo) url += `&dateTo=${dateTo}`;
                return url;
            },
            transformResponse: (response) => {
                if (response.leads) {
                    response.leads = response.leads.map(lead => ({
                        ...lead,
                        phone: lead.mobile_number,
                        createdAt: new Date(lead.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        }),
                    }));
                }
                return response;
            },
            providesTags: ['Lead'],
        }),
        getLeadById: builder.query({
            query: (id) => `leads/${id}`,
            providesTags: (result, error, id) => [{ type: 'Lead', id }],
        }),
        createLead: builder.mutation({
            query: (data) => ({
                url: 'leads',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Lead'],
        }),
        updateLead: builder.mutation({
            query: ({ id, data }) => ({
                url: `leads/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Lead', { type: 'Lead', id }],
        }),
        deleteLead: builder.mutation({
            query: (id) => ({
                url: `leads/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Lead'],
        }),
        hitCall: builder.mutation({
            query: ({ id, status, next_call_at, drop_reason }) => ({
                url: `leads/${id}/hit-call`,
                method: 'POST',
                body: { status, next_call_at, drop_reason },
            }),
            invalidatesTags: (result, error, { id }) => ['Lead', { type: 'Lead', id }],
        }),
        analyzeLead: builder.mutation({
            query: (id) => ({
                url: `leads/${id}/analyze`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => ['Lead', { type: 'Lead', id }],
        }),
        getAssignmentSettings: builder.query({
            query: () => 'lead-assignment/settings',
            providesTags: ['LeadAssignmentSettings'],
        }),
        updateAssignmentSettings: builder.mutation({
            query: (data) => ({
                url: 'lead-assignment/settings',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['LeadAssignmentSettings'],
        }),
        getAssignmentLogs: builder.query({
            query: ({ page = 1, limit = 10 }) => `lead-assignment/logs?page=${page}&limit=${limit}`,
            providesTags: ['LeadAssignmentLogs'],
        }),
        manualAssignLeads: builder.mutation({
            query: (data) => ({
                url: 'lead-assignment/assign-manual',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Lead'],
        }),
    }),
});

export const {
    useGetLeadsQuery,
    useGetLeadByIdQuery,
    useCreateLeadMutation,
    useUpdateLeadMutation,
    useDeleteLeadMutation,
    useHitCallMutation,
    useAnalyzeLeadMutation,
    useGetAssignmentSettingsQuery,
    useUpdateAssignmentSettingsMutation,
    useGetAssignmentLogsQuery,
    useManualAssignLeadsMutation,
} = leadApi;
