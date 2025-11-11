import React, { createContext, useContext, useState, useCallback } from 'react';
import styles from './Toast.module.scss';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

// Toast Context
const ToastContext = createContext<any>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);
    const dispatch = useDispatch();
    // Add a new toast
    const addToast = useCallback((message: string) => {

        if (message == "Unauthorized") {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            addToast("Logged out successfully");
            dispatch(logout());
        }


        const id = Date.now().toString(); // Unique ID
        setToasts((prev) => [...prev, { id, message }]);

        // Store the timeout ID
        const timeoutId = setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);

        // Return a cleanup function to clear the timeout
        return () => clearTimeout(timeoutId);
    }, [setToasts]);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map((toast) => (
                    <Toast key={toast.id} message={toast.message} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// Hook to use the Toast context
export const useToast = () => useContext(ToastContext);

// Toast Component
export const Toast: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className={styles.toast}>
            {message}
        </div>
    );
};