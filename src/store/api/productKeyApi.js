import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productKeyApi = createApi({
    reducerPath: "productKeyApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}product-keys`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["ProductKey"],
    endpoints: (builder) => ({
        getProductKeys: builder.query({
            query: (params) => ({
                url: "/",
                params,
            }),
            providesTags: ["ProductKey"],
        }),
        getProductKey: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "ProductKey", id }],
        }),
        createProductKey: builder.mutation({
            query: (body) => ({
                url: "/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["ProductKey"],
        }),
        updateProductKey: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => ["ProductKey", { type: "ProductKey", id }],
        }),
        deleteProductKey: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ProductKey"],
        }),
    }),
});

export const {
    useGetProductKeysQuery,
    useGetProductKeyQuery,
    useCreateProductKeyMutation,
    useUpdateProductKeyMutation,
    useDeleteProductKeyMutation,
} = productKeyApi;
