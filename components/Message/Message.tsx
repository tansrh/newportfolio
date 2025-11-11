import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CommonTextInput from '../common/CommonTextInput';
import CommonTextareaInput from '../common/CommonTextareaInput';
import CommonButton from '../common/CommonButton';
import ErrorMessage from '../Error/ErrorMessage';
import styles from './Message.module.scss';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/slices/modalSlice';
import { useToast } from '../ToastProvider';

interface MessageFormData {
    name: string;
    email: string;
    message: string;
}

export default function Message() {
    const { register, handleSubmit, getValues, formState: { errors }, reset, setValue } = useFormContext<MessageFormData>();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const dispatch = useDispatch();
    const { addToast } = useToast();
     useEffect(()=>{
         if (statusMessage) {
             const timer = setTimeout(() => {
                 setStatusMessage(null);
                dispatch(closeModal());
             }, 3000);
             return () => clearTimeout(timer);
         }
     }, [statusMessage]);
    const onSend = async (data: MessageFormData) => {
        try {
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatusMessage('Message sent successfully!');
                addToast('Message sent successfully!');
            } else {
                setStatusMessage('Failed to send message. Please try again.');
                addToast('Failed to send message. Please try again.');
            }
            reset();
        } catch (error) {
            setStatusMessage('An unexpected error occurred. Please try again.');
            addToast('An unexpected error occurred. Please try again.');
            reset();
        }
    };

    return (
        <form className={styles.wrapper} onSubmit={handleSubmit(onSend)}>
            <>
                <CommonTextInput
                    label="Name"
                    placeholder="Your name"
                    {...register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                />
                {errors.name && <ErrorMessage message={typeof errors.name.message === 'string' ? errors.name.message : 'Invalid name'} />}
            </>
            <>
                <CommonTextInput
                    label="Email"
                    placeholder="Your email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email address' }
                    })}
                />
                {errors.email && <ErrorMessage message={typeof errors.email.message === 'string' ? errors.email.message : 'Invalid email'} />}
            </>
            <>
                <CommonTextareaInput
                    label="Message"
                    value={getValues("message")}
                    placeholder="Your message"
                    {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' }
                    })}
                    setValue={setValue}
                />
                {errors.message && <ErrorMessage message={typeof errors.message.message === 'string' ? errors.message.message : 'Invalid message'} />}
            </>
            <div className={styles.buttonRow}>
                <CommonButton type="submit">Send</CommonButton>
            </div>
            {statusMessage && <div className={styles.statusMessage}>{statusMessage}</div>}
        </form>
    );
}
