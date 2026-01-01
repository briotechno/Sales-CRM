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
      query: (salaryData) => ({
        url: "salaries",
        method: "POST",
        body: salaryData,
      }),
      invalidatesTags: ["Salaries"], // Refresh salaries after creation
    }),

    updateSalary: builder.mutation({
      query: ({ id, ...salary }) => ({
        url: `salaries/${id}`,
        method: "PUT",
        body: salary,
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
