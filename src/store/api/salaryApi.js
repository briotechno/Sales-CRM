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
      query: () =>
        `salaries`,
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
