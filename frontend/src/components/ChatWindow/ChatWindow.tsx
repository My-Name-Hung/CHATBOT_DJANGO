import { useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageItem } from '../MessageItem/MessageItem';
import { ChatInput } from '../ChatInput/ChatInput';
import logo from '../../assets/logo/icon.png';
import styles from './ChatWindow.module.css';

export const ChatWindow = () => {
  const { messages, loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <img src={logo} alt="ChatSF Logo" className={styles.emptyLogo} />
            <h2>Chào mừng đến với ChatSF</h2>
            <p>Bắt đầu cuộc trò chuyện bằng cách nhập tin nhắn bên dưới</p>
          </div>
        ) : (
          <div className={styles.messageList}>
            {messages.map((msg, idx) => (
              <MessageItem key={idx} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
        {loading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
            <div className={styles.loadingDot}></div>
          </div>
        )}
      </div>
      <ChatInput />
    </div>
  );
};
