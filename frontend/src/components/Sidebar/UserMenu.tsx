import { useEffect } from 'react';

import type { User } from '../../utils/types';
import styles from './Sidebar.module.css';

type Props = {
  open: boolean;
  user: User;
  onClose: () => void;
  onLogout: () => void;
};

export const UserMenu = ({ open, user, onClose, onLogout }: Props) => {
  const safeEmail = user?.email || '';
  const firstLetter = safeEmail.slice(0, 1).toUpperCase() || 'U';
  const username = safeEmail.split('@')[0] || 'User';

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.userMenuOverlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.userMenu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.userMenuHeader}>
          <div className={styles.avatar}>{firstLetter}</div>
          <div className={styles.userMeta}>
            <div className={styles.userName}>{username}</div>
            <div className={styles.userHandle}>@{username}</div>
          </div>
        </div>

        <div className={styles.userMenuDivider} />

        <button className={styles.userMenuItem} onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

