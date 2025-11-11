"use client";
import { Provider } from "react-redux";
import { store } from "../store/rootStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ProvidersWrapper from "./ProvidersWrapper";
import { ToastProvider } from "./ToastProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Infinity,
                refetchOnMount: false,
                refetchOnWindowFocus: false
            },
        },
    });

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <ProvidersWrapper>
                        {children}
                    </ProvidersWrapper>
                </ToastProvider>
            </QueryClientProvider>
        </Provider>
    );
}
