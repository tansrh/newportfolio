"use client";
import { Provider } from "react-redux";
import { store } from "../store/rootStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ProvidersWrapper from "./ProvidersWrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ProvidersWrapper>
                    {children}
                </ProvidersWrapper>
            </QueryClientProvider>
        </Provider>
    );
}
