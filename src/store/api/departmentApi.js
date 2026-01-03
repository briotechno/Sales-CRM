import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const departmentApi = createApi({
    reducerPath: 'departmentApi',
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
    tagTypes: ['Department'],
    endpoints: (builder) => ({
        getDepartments: builder.query({
            query: ({ page = 1, limit = 10, status = 'All', search = '' }) => {
                let url = `departments?page=${page}&limit=${limit}`;
                if (status !== 'All') {
                    url += `&status=${status}`;
                }
                if (search) {
                    url += `&search=${search}`;
                }
                return url;
            },
            providesTags: ['Department'],
            transformResponse: (response) => {
                if (response.departments) {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api/', '');
                    response.departments = response.departments.map(dept => ({
                        ...dept,
                        icon_url: dept.icon ? `${baseUrl}${dept.icon}` : null
                    }));
                }
                return response;
            },
        }),
        getDepartmentById: builder.query({
            query: (id) => `departments/${id}`,
            providesTags: (result, error, id) => [{ type: 'Department', id }],
        }),
        createDepartment: builder.mutation({
            query: (newDepartment) => ({
                url: 'departments',
                method: 'POST',
                body: newDepartment,
            }),
            invalidatesTags: ['Department'],
        }),
        updateDepartment: builder.mutation({
            query: ({ id, data }) => ({
                url: `departments/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Department', { type: 'Department', id }],
        }),
        deleteDepartment: builder.mutation({
            query: (id) => ({
                url: `departments/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Department'],
        }),
    }),
});

export const {
    useGetDepartmentsQuery,
    useGetDepartmentByIdQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation,
} = departmentApi;
