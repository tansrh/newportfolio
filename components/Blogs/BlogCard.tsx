import React from 'react';
import Link from 'next/link';
import styles from './BlogCard.module.scss';
import type { BlogData } from '../../store/slices/blogsSlice';
import CommonImage from '../common/CommonImage';
import ImageWithFallback from '../common/ImageWithFallback';

interface BlogCardProps {
  blog: BlogData;
  idx: number;
  onClick?: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, idx, onClick }) => (
  <div className={styles.blogCard} onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
    <Link href={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <ImageWithFallback
        src={blog.image || '/images/fallback.jpeg'}
        alt={blog.title}
        className={styles.blogImage}
      />
      <div className={styles.blogContent}>
        <h2 className={styles.blogTitle}>{blog.title}</h2>
        <h4 className={styles.blogSubtitle}>{blog.subtitle}</h4>
        <p className={styles.blogDescription}>{blog.content.slice(0, 100)}...</p>
      </div>
    </Link>
  </div>
);

export default BlogCard;
