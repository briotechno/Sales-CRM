import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const walletApi = createApi({
    reducerPath: "walletApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BASE_URL}wallet`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Wallet"],
    endpoints: (builder) => ({
        getWalletStats: builder.query({
            query: () => "/stats",
            providesTags: ["Wallet"],
        }),
        getWalletUpgrades: builder.query({
            query: (params) => ({
                url: "/upgrades",
                params,
            }),
            providesTags: ["Wallet"],
        }),
    }),
});

export const {
    useGetWalletStatsQuery,
    useGetWalletUpgradesQuery,
} = walletApi;
