"use client";
import { useDispatch } from "react-redux";
import React from "react";
import { login } from "@/store/slices/authSlice";

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    // Hydrate auth state from localStorage
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = window.localStorage.getItem('authToken');
            const refreshToken = window.localStorage.getItem('refreshToken');
            if(authToken && refreshToken){
                dispatch(login({
                authToken: authToken || '',
                refreshToken: refreshToken || '',
            }))
            }
            
        }
    }, []);
    return (
        <>
        {children}
        </>
    );
}
