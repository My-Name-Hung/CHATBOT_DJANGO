import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { ChatWindow } from '../components/ChatWindow/ChatWindow';
import styles from './ChatPage.module.css';

export const ChatPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className={styles.chatPage}>
      <Sidebar />
      <ChatWindow />
    </div>
  );
};
