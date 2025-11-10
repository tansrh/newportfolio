import styles from './ErrorMessage.module.scss';
import React from 'react';

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return <span className={styles.error}>{message}</span>;
};

export default ErrorMessage;
