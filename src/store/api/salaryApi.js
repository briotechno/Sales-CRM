import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const salaryApi = createApi({
  reducerPath: "salaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // get token from localStorage (or Redux state)
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Salaries"],
  endpoints: (builder) => ({
    getAllSalaries: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.department) queryParams.append('department', params.department);
        if (params?.designation) queryParams.append('designation', params.designation);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.startDate) queryParams.append('startDate', params.startDate);
        if (params?.endDate) queryParams.append('endDate', params.endDate);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        return `salaries?${queryParams.toString()}`;
      },
      providesTags: ["Salaries"],
    }),

    createSalary: builder.mutation({
      query: (data) => ({
        url: "salaries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Salaries"],
    }),

    updateSalary: builder.mutation({
      query: ({ id, data }) => ({
        url: `/salaries/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Salaries"],
    }),

    deleteSalary: builder.mutation({
      query: (id) => ({
        url: `salaries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Salaries"],
    }),
  }),
});

export const {
  useGetAllSalariesQuery,
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
} = salaryApi;
