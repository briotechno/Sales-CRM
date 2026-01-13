import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const planApi = createApi({
    reducerPath: "planApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}plans`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Plan"],
    endpoints: (builder) => ({
        getPlans: builder.query({
            query: (params) => ({
                url: "/",
                params,
            }),
            providesTags: ["Plan"],
        }),
        getPlanById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Plan", id }],
        }),
        createPlan: builder.mutation({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Plan"],
        }),
        updatePlan: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Plan", { type: "Plan", id }],
        }),
        deletePlan: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Plan"],
        }),
    }),
});

export const {
    useGetPlansQuery,
    useGetPlanByIdQuery,
    useCreatePlanMutation,
    useUpdatePlanMutation,
    useDeletePlanMutation,
} = planApi;
