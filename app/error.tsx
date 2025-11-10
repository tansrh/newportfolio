'use client';
import React from 'react';
import styles from './error.module.scss';

export default function Error({ message }: { message?: string }) {
    return (
        <div className={styles.errorContainer}>
            <div className={styles.errorContent}>
                <h1 className={styles.errorTitle}>Something went wrong</h1>
                <p className={styles.errorMessage}>{message || 'An unexpected error occurred. Please try again later.'}</p>
            </div>
        </div>
    );
}