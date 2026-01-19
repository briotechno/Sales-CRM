import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const stageApi = createApi({
    reducerPath: "stageApi",
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
    tagTypes: ["Stage"],
    endpoints: (builder) => ({
        getStages: builder.query({
            query: () => "/stages",
            providesTags: ["Stage"],
        }),
        createStage: builder.mutation({
            query: (data) => ({
                url: "/stages",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Stage"],
        }),
        updateStage: builder.mutation({
            query: ({ id, data }) => ({
                url: `/stages/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Stage"],
        }),
        deleteStage: builder.mutation({
            query: (id) => ({
                url: `/stages/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Stage"],
        }),
    }),
});

export const {
    useGetStagesQuery,
    useCreateStageMutation,
    useUpdateStageMutation,
    useDeleteStageMutation,
} = stageApi;
