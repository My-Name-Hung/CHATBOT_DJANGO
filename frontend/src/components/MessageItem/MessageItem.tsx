import type { Message } from '../../utils/types';
import styles from './MessageItem.module.css';
import logo from '../../assets/logo/icon.png';

interface MessageItemProps {
  message: Message;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles.messageWrapper} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.message}>
        <div className={styles.avatar}>
          {isUser ? <img src={logo} alt="User Avatar" className={styles.avatarImage} /> : <img src={logo} alt="Assistant Avatar" className={styles.avatarImage} />}
        </div>
        <div className={styles.content}>
          <div className={styles.text}>{message.content}</div>
          {message.timestamp && (
            <div className={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

