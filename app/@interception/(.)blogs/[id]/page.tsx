'use client';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/rootStore';
import BlogDetailsWrapper from '../../../../components/Blogs/BlogDetailsWrapper';
import styles from './intercept.module.scss';
import { useRouter } from 'next/navigation';

export default function InterceptPage() {
    const selectedBlog = useSelector((state: RootState) => state.blogs.selectedBlog);
    const router = useRouter();
    const modalRef = useRef(null);

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && !(modalRef.current as any).contains(e.target)) {
            router.back();
        } else if (modalRef.current && (modalRef.current as any).contains(e.target)) {
            window.location.reload();
        }
    };

    if (!selectedBlog) {
        return (
            <div className={styles.interceptWrapper} onClick={handleClickOutside}>
                <div style={{ color: '#888', fontSize: '1.5rem' }} ref={modalRef}>Blog not found.</div>
            </div>
        );
    }
    return (
        <div className={styles.interceptWrapper} onClick={handleClickOutside}>
            <div ref={modalRef}>
                <BlogDetailsWrapper blog={selectedBlog} />
            </div>
        </div>
    );
}
