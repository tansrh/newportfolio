'use client';

import React, { Suspense, useCallback } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/utils/apiRequest';
import styles from './page.module.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/rootStore';
import type { BlogData } from '../../store/slices/blogsSlice';
import { setSearchResults, clearSearchResults, setSelectedBlog } from '../../store/slices/blogsSlice';
import BlogCard from '../../components/Blogs/BlogCard';
import CommonButton from '../../components/common/CommonButton';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import CommonTextInput from '@/components/common/CommonTextInput';
import { openModal } from '@/store/slices/modalSlice';
import Loading from '../loading';


export default function Page({children}: {children: React.ReactNode}) {
    // Remove Redux blogs usage for infinite query
    // Infinite query for blogs
    const fetchBlogs = useCallback(async ({ pageParam = 0 }) => {
        const take = 5;
        const data = await apiRequest(`/api/blogs?skip=${pageParam}&take=${take}`, 'GET');
        return { blogs: data.blogs, nextSkip: pageParam + take, hasMore: data.blogs.length === take };
    }, []);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['blogs'],
        queryFn: fetchBlogs,
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextSkip : undefined,
        initialPageParam: 0,
    });
    const searchResults = useSelector((state: RootState) => state.blogs.searchResults) || [];
    const dispatch = useDispatch();
    const router = useRouter();
    const [search, setSearch] = React.useState('');
    const [debouncedSearch, setDebouncedSearch] = React.useState(search);
    const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);
    // Debounce effect to update debouncedSearch after user stops typing
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // Adjust the delay as needed (300ms in this case)
        setShowSearchDropdown(true);
        return () => {
            clearTimeout(handler);
        };
    }, [search]);

    const searchQuery = useQuery({
        queryKey: ['searchBlogs', debouncedSearch],
        queryFn: async () => {
            if (!debouncedSearch.trim()) return [];
            const data = await apiRequest(`/api/blogs?search=${encodeURIComponent(debouncedSearch)}`, 'GET');
            return data.blogs;
        },
        enabled: false, // Only run when manually triggered
    });
    // Manual search trigger
    React.useEffect(() => {
        if (debouncedSearch.trim().length > 0) {
            searchQuery.refetch().then(result => {
                dispatch(setSearchResults(result.data || []));
                
            });
        } else {
            dispatch(clearSearchResults());
            setShowSearchDropdown(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, dispatch]);

    const bottomRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!hasNextPage || isFetchingNextPage) return;
        const observer = new window.IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            { threshold: 1 }
        );
        if (bottomRef.current) observer.observe(bottomRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const searchDropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
                setShowSearchDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [setShowSearchDropdown]);

    return (
        <>
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <CommonButton
                    style={{ padding: '0.5rem 1.2rem', fontSize: '1rem', borderRadius: '8px', background: '#222', color: '#fff' }}
                    onClick={() => {dispatch(openModal({content: 'BlogDetailsEditForm', props: { isNewBlog: true }}));}}
                >
                    Add Blog
                </CommonButton>
            </div>
            <div className={styles.searchInputWrapper}>
                <CommonTextInput
                    type="text"
                    placeholder="Search blogs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchBar}
                />
                {showSearchDropdown && search.trim().length > 0 && (
                    <div className={styles.searchDropdown} ref={searchDropdownRef}>
                        {searchQuery.isSuccess && (searchResults?.length > 0) ? (
                            searchResults.map((blog: BlogData, idx: number) => (
                                <div
                                    key={idx}
                                    className={styles.dropdownItem}
                                    onClick={() => {
                                        dispatch(setSelectedBlog(blog));
                                        router.push(`/blogs/${blog.id}`);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={styles.dropdownTitle}>{blog.title}</div>
                                    <div className={styles.dropdownSubtitle}>{blog.subtitle}</div>
                                    <div className={styles.dropdownDate}>Nov 9, 2025</div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.dropdownItem}>{ (searchQuery.isFetching || searchQuery.isLoading) ? "Searching..." : "No blogs found."}</div>
                        )}
                    </div>
                )}
            </div>
            <h2 className={styles.subheading}>Latest Blogs</h2>
            <div className={styles.blogsGrid}>
                <Suspense fallback={<Loading />}>
                {data?.pages?.flatMap(page => page.blogs).map((blog: BlogData, idx: number) => (
                    <BlogCard key={blog.id} blog={blog} idx={idx} onClick={() => {
                        dispatch(setSelectedBlog(blog));
                    }} />
                ))}
                </Suspense>
                {/* Sentinel element for infinite scroll */}
                <div ref={bottomRef} style={{ height: 1 }} />
            </div>
        </div>
        {children}
        </>
    );
}