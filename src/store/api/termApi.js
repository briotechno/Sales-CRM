import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const termApi = createApi({
  reducerPath: "termApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Terms"],
  endpoints: (builder) => ({
    getAllTerms: builder.query({
      query: ({ page = 1, limit = 5, search = "", department = "", designation = "" }) => ({
        url: "/terms",
        params: { page, limit, search, department, designation },
      }),
      providesTags: ["Terms"],
    }),

    createTerm: builder.mutation({
      query: (body) => ({
        url: "/terms",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Terms"],
    }),

    updateTerm: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/terms/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Terms"],
    }),

    deleteTerm: builder.mutation({
      query: (id) => ({
        url: `/terms/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Terms"],
    }),
  }),
});

export const {
  useGetAllTermsQuery,
  useCreateTermMutation,
  useUpdateTermMutation,
  useDeleteTermMutation,
} = termApi;
