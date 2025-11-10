'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/rootStore';
import styles from './Modal.module.scss';

import { BlogDetailsEditForm } from '../Blogs/BlogDetailsWrapper';
import { FormProvider, useForm } from 'react-hook-form';
import { closeModal } from '@/store/slices/modalSlice';
import Login from '../Login/Login';
import Message from '../Message/Message';

const MODAL_COMPONENTS: Record<string, React.ComponentType<any>> = {
	BlogDetailsEditForm: BlogDetailsEditForm,
    Login: Login,
	Message: Message
};

export default function Modal() {
	const { isOpen, content, props } = useSelector((state: RootState) => state.modal);
    const methods = useForm({});
    const dispatch = useDispatch();
	if (!isOpen || !content) return null;
	const Component = MODAL_COMPONENTS[content];
	if (!Component) return null;
    
	return (
		<div className={styles.overlay} onClick={(e) => {dispatch(closeModal()); e.stopPropagation();}}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <FormProvider {...methods}>
				<Component {...props} />
                </FormProvider>
			</div>
		</div>
	);
}
