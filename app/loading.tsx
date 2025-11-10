import React from 'react';
import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingContent}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Loading...</p>
            </div>
        </div>
    );
}