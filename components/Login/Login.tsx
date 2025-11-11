
import React, { useState } from 'react';
import { useFormContext, FieldError } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/utils/apiRequest';
import CommonTextInput from '../common/CommonTextInput';
import CommonButton from '../common/CommonButton';
import ErrorMessage from '../Error/ErrorMessage';
import styles from './Login.module.scss';
import { loginValidationConfig } from '../../validationConfig';
import { setLocalStorage } from '@/utils/localStorage';
import { useDispatch } from 'react-redux';
import { closeModal } from '@/store/slices/modalSlice';
import { login } from '@/store/slices/authSlice';
import { useToast } from '../ToastProvider';

export default function Login() {
  const dispatch = useDispatch();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useFormContext();
  const { addToast } = useToast();
  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: (email: string) => apiRequest('/api/login', 'POST', { email }),
    onSuccess: () => {
      setStep('otp');
      setValue('otp', '');
      setErrorMsg(null);
      addToast('OTP sent to your email');
    },
    onError: (error: any) => {
      setErrorMsg(error?.message || 'Failed to send OTP. Please try again.');
      addToast(error?.message || 'Failed to send OTP. Please try again.');
    },
  });

  // React Query mutation for OTP verification
  const verifyOtpMutation = useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      apiRequest('/api/verify', 'POST', payload),
    onSuccess: (data) => {
      setErrorMsg(null);
      setLocalStorage('authToken', data.authToken);
      setLocalStorage('refreshToken', data.refreshToken);
      dispatch(closeModal());
      dispatch(login({ authToken: data.authToken, refreshToken: data.refreshToken }));
      addToast('Logged in successfully!');
    },
    onError: (error: any) => {
      setErrorMsg(error?.message || 'OTP verification failed. Please try again.');
      addToast(error?.message || 'OTP verification failed. Please try again.');
    },
  });

  const onEmailSubmit = (data: any) => {
    setErrorMsg(null);
    loginMutation.mutate(data.email);
  };

  const onOtpSubmit = (data: any) => {
    setErrorMsg(null);
    verifyOtpMutation.mutate({ email: data.email, otp: data.otp });
  };


  return (
    <div className={styles.loginWrapper}>

      {step === 'email' ? (
        <form className={styles.form} onSubmit={handleSubmit(onEmailSubmit)}>
          <CommonTextInput
            label="Email"
            placeholder="Enter your email"
            {...register('email', {
              validate: (value: string | undefined) => {
                for (const test of loginValidationConfig.email) {
                  if (!test.test(value ?? '')) return test.errorMessage;
                }
                return true;
              }
            })}
          />
          {errors.email && <ErrorMessage message={typeof errors.email.message === 'string' ? errors.email.message : 'Invalid email'} />}
          <CommonButton type="submit" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Sending...' : 'Send OTP'}
          </CommonButton>
        </form>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit(onOtpSubmit)}>
          <CommonTextInput
            label="OTP"
            placeholder="Enter OTP"
            {...register('otp', {
              required: 'OTP is required',
              minLength: { value: 6, message: 'OTP must be at least 6 digits' },
              maxLength: { value: 6, message: 'OTP must be at most 6 digits' },
              pattern: { value: /^[0-9]+$/, message: 'OTP must be numeric' }
            })}
          />
          {errors.otp && <ErrorMessage message={typeof errors.otp.message === 'string' ? errors.otp.message : 'Invalid OTP'} />}
          <CommonButton type="submit" disabled={verifyOtpMutation.isPending}>
            {verifyOtpMutation.isPending ? 'Verifying...' : 'Login'}
          </CommonButton>
        </form>
      )}
      {errorMsg && <ErrorMessage message={errorMsg} />}
    </div>
  );
}
