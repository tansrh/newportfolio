'use client';
import type { BlogData } from '../../store/slices/blogsSlice';
import styles from './BlogDetailsWrapper.module.scss';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import CommonTextInput from '../common/CommonTextInput';
import CommonTextareaInput from '../common/CommonTextareaInput';
import { blogsValidationConfig } from '../../validationConfig';
import ErrorMessage from '../Error/ErrorMessage';
import CommonButton from '../common/CommonButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/utils/apiRequest';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/slices/modalSlice';
import ImageWithFallback from '../common/ImageWithFallback';

interface BlogDetailsWrapperProps {
    blog: BlogData;
    edit?: boolean;
}
interface BlogDetailsEditFormProps {
    isNewBlog?: boolean;
}

function useBlogMutation(): any {
    const router = useRouter();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (variables: { type: 'create' | 'update' | 'delete'; data: any }) => {
            const { type, data } = variables;
            if (type === 'create') {
                return apiRequest('/api/blogs', 'POST', data);
            }
            if (type === 'update') {
                return apiRequest('/api/blogs', 'PUT', data);
            }
            if (type === 'delete') {
                return apiRequest('/api/blogs', 'DELETE', data);
            }
            throw new Error('Invalid mutation type');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] }); // Corrected the query key type
            dispatch(closeModal());
            router.push('/blogs');
        }
    });
}
let blogMutation: any;
const BlogDetailsWrapper: React.FC<BlogDetailsWrapperProps> = ({ blog, edit = false }) => {
    const methods = useForm<BlogData>({
        defaultValues: blog,
    });
    blogMutation = useBlogMutation();
    if (!edit) {
        let today = new Date(blog.createdAt || Date.now());
        const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return (
            <div className={styles.wrapper}>
                {blog ? (
                    <>
                        <ImageWithFallback
                            src={blog.image || '/images/fallback.jpeg'}
                            alt={blog.title}
                            className={styles.image}
                        />
                        <div className={styles.date}>{formattedDate}</div>
                        <h1 className={styles.title}>{blog.title}</h1>
                        {blog.subtitle && <h2 className={styles.subtitle}>{blog.subtitle}</h2>}
                        <p
                            className={styles.content}
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </>
                ) : (
                    <div className={styles.notFound}>Blog not found.</div>
                )}
            </div>
        );
    }

    return (
        <FormProvider {...methods}>
            <BlogDetailsEditForm />
        </FormProvider>
    );
};

export function BlogDetailsEditForm({ isNewBlog }: BlogDetailsEditFormProps) {
    const { register, formState: { errors }, handleSubmit, reset, getValues } = useFormContext<BlogData>();
    const router = useRouter();
    const dispatch = useDispatch();

    if (!blogMutation) {
        blogMutation = useBlogMutation();
    }
    const onSave = (data: BlogData) => {
        blogMutation.mutate(
            { type: isNewBlog ? 'create' : 'update', data },
        );
        reset();
    };
    const onDelete = () => {
        blogMutation.mutate(
            { type: 'delete', data: { id: getValues('id') } },
        );
        reset();
    };
    const onDiscard = () => {
        reset();
        router.push('/blogs');
        dispatch(closeModal());
    };

    return (
        <form className={styles.wrapper} onSubmit={handleSubmit(onSave)}>
            <>
                <CommonTextInput
                    label="Image URL"
                    placeholder="Image URL"
                    {...register('image', {
                        validate: (value: string | undefined) => {
                            for (const test of blogsValidationConfig.image) {
                                if (!test.test(value ?? '')) return test.errorMessage;
                            }
                            return true;
                        }
                    })}
                />
                {errors.image && <ErrorMessage message={errors.image.message} />}
            </>
            <>
                <CommonTextInput
                    label="Title"
                    placeholder="Title"
                    {...register('title', {
                        validate: (value: string | undefined) => {
                            for (const test of blogsValidationConfig.title) {
                                if (!test.test(value ?? '')) return test.errorMessage;
                            }
                            return true;
                        }
                    })}
                />
                {errors.title && <ErrorMessage message={errors.title.message} />}
            </>
            <>
                <CommonTextInput
                    label="Subtitle"
                    placeholder="Subtitle"
                    {...register('subtitle', {
                        validate: (value: string | undefined) => {
                            for (const test of blogsValidationConfig.subtitle) {
                                if (!test.test(value ?? '')) return test.errorMessage;
                            }
                            return true;
                        }
                    })}
                />
                {errors.subtitle && <ErrorMessage message={errors.subtitle.message} />}
            </>
            <>
                <CommonTextareaInput
                    label="Description"
                    placeholder="Description"
                    {...register('content', {
                        validate: (value: string | undefined) => {
                            for (const test of blogsValidationConfig.content) {
                                if (!test.test(value ?? '')) return test.errorMessage;
                            }
                            return true;
                        }
                    })}
                />
                {errors.content && <ErrorMessage message={errors.content.message} />}
            </>
            <div className={styles.buttonRow}>
                <CommonButton type="submit">Save</CommonButton>
                <CommonButton type="button" onClick={onDiscard} style={{ background: '#eee', color: '#222' }}>Discard</CommonButton>
                {!isNewBlog && <CommonButton type="button" onClick={onDelete} style={{ background: '#4CAF50', color: '#fff' }}>Delete</CommonButton>}
            </div>
        </form>
    );
}

export default BlogDetailsWrapper;
