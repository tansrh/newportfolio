'use client';
import React, { Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../store/rootStore';
import BlogDetailsWrapper from '../../../components/Blogs/BlogDetailsWrapper';
import styles from './page.module.scss';
import { apiRequest } from '@/utils/apiRequest';
import { setSelectedBlog } from '@/store/slices/blogsSlice';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import Loading from '@/app/loading';

export default function Page() {
    const selectedBlog = useSelector((state: RootState) => state.blogs.selectedBlog);
    const isUserLoggedIn = useSelector((state: RootState) => state.auth.loggedIn);
    const dispatch = useDispatch();
    const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : undefined;

    const { data, isLoading } = useQuery({
        queryKey: ['blog', id],
        queryFn: async () => {
            if (!id) throw new Error('Blog not found.');
            const result = await apiRequest(`/api/blogs/${id}`, 'GET');
            if (result.success && result.blog) {
                dispatch(setSelectedBlog(result.blog));
                return result.blog ?? {};
            }
            throw new Error('Blog not found.');
        },
        enabled: !selectedBlog && !!id,
    });

    const blogToShow = selectedBlog || data;
    if (isLoading) {
        return <Loading />;
    }
    if (!blogToShow && !isLoading) {
        notFound();
    }
    return <BlogDetailsWrapper blog={blogToShow} edit={isUserLoggedIn} />;
}