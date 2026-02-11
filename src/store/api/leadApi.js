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
        getLeadNotes: builder.query({
            query: (id) => `leads/${id}/notes`,
            providesTags: (result, error, id) => [{ type: 'LeadNotes', id }],
        }),
        addLeadNote: builder.mutation({
            query: ({ id, data }) => ({
                url: `leads/${id}/notes`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'LeadNotes', id }, 'Lead'],
        }),
        getLeadCalls: builder.query({
            query: (id) => `leads/${id}/calls`,
            providesTags: (result, error, id) => [{ type: 'LeadCalls', id }],
        }),
        addLeadCall: builder.mutation({
            query: ({ id, data }) => ({
                url: `leads/${id}/calls`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'LeadCalls', id }, 'Lead'],
        }),
        getLeadFiles: builder.query({
            query: (id) => `leads/${id}/files`,
            providesTags: (result, error, id) => [{ type: 'LeadFiles', id }],
        }),
        addLeadFile: builder.mutation({
            query: ({ id, data }) => ({
                url: `leads/${id}/files`,
                method: 'POST',
                body: data, // Form data usually
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'LeadFiles', id }, 'Lead'],
        }),
        getLeadActivities: builder.query({
            query: (id) => `leads/${id}/activities`,
            providesTags: (result, error, id) => [{ type: 'LeadActivities', id }],
        }),
        getLeadMeetings: builder.query({
            query: (id) => `leads/${id}/meetings`,
            providesTags: (result, error, id) => [{ type: 'LeadMeetings', id }],
        }),
        addLeadMeeting: builder.mutation({
            query: ({ id, data }) => ({
                url: `leads/${id}/meetings`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'LeadMeetings', id }, 'Lead'],
        }),
        updateLeadStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `leads/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => ['Lead', { type: 'Lead', id }],
        }),
        // Update mutations
        updateLeadNote: builder.mutation({
            query: ({ leadId, noteId, data }) => ({
                url: `leads/${leadId}/notes/${noteId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadNotes', id: leadId }],
        }),
        updateLeadCall: builder.mutation({
            query: ({ leadId, callId, data }) => ({
                url: `leads/${leadId}/calls/${callId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadCalls', id: leadId }],
        }),
        updateLeadFile: builder.mutation({
            query: ({ leadId, fileId, data }) => ({
                url: `leads/${leadId}/files/${fileId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadFiles', id: leadId }],
        }),
        updateLeadMeeting: builder.mutation({
            query: ({ leadId, meetingId, data }) => ({
                url: `leads/${leadId}/meetings/${meetingId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadMeetings', id: leadId }],
        }),
        // Delete mutations
        deleteLeadNote: builder.mutation({
            query: ({ leadId, noteId }) => ({
                url: `leads/${leadId}/notes/${noteId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadNotes', id: leadId }],
        }),
        deleteLeadCall: builder.mutation({
            query: ({ leadId, callId }) => ({
                url: `leads/${leadId}/calls/${callId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadCalls', id: leadId }],
        }),
        deleteLeadFile: builder.mutation({
            query: ({ leadId, fileId }) => ({
                url: `leads/${leadId}/files/${fileId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadFiles', id: leadId }],
        }),
        deleteLeadMeeting: builder.mutation({
            query: ({ leadId, meetingId }) => ({
                url: `leads/${leadId}/meetings/${meetingId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { leadId }) => [{ type: 'LeadMeetings', id: leadId }],
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
    useGetLeadNotesQuery,
    useAddLeadNoteMutation,
    useGetLeadCallsQuery,
    useAddLeadCallMutation,
    useGetLeadFilesQuery,
    useAddLeadFileMutation,
    useGetLeadActivitiesQuery,
    useGetLeadMeetingsQuery,
    useAddLeadMeetingMutation,
    useUpdateLeadStatusMutation,
    useUpdateLeadNoteMutation,
    useUpdateLeadCallMutation,
    useUpdateLeadFileMutation,
    useUpdateLeadMeetingMutation,
    useDeleteLeadNoteMutation,
    useDeleteLeadCallMutation,
    useDeleteLeadFileMutation,
    useDeleteLeadMeetingMutation,
} = leadApi;
