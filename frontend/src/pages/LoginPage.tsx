import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm/LoginForm';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [flash, setFlash] = useState('');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const msg = localStorage.getItem('flash_message') || '';
    if (!msg) return;
    localStorage.removeItem('flash_message');
    setFlash(msg);
    const t = window.setTimeout(() => setFlash(''), 1200);
    return () => window.clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <span>Đang tải...</span>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {flash && (
        <div className={styles.toastOverlay}>
          <div className={styles.toastCard}>
            <div className={styles.toastTitle}>Thành công</div>
            <div className={styles.toastText}>{flash}</div>
          </div>
        </div>
      )}
      <div className={styles.leftPanel}>
        <div className={styles.leftOverlay}>
          <div className={styles.badge}>CHAT SF</div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <LoginForm />
      </div>
    </div>
  );
};
