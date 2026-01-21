import { useMemo, useState } from 'react';

import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { SearchModal } from './SearchModal';
import { SidebarHeader } from './SidebarHeader';
import { UserMenu } from './UserMenu';
import { GoPlus } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import styles from './Sidebar.module.css';

function groupLabel(date: Date): string {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfThat = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((startOfToday.getTime() - startOfThat.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN');
}

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { history, selectedHistoryId, loadHistorySession, startNewChat } = useChat();
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const grouped = useMemo(() => {
    const out: Record<string, typeof history> = {};
    for (const h of history) {
      const label = groupLabel(new Date(h.createdAt));
      out[label] = out[label] || [];
      out[label].push(h);
    }
    return out;
  }, [history]);

  const chatTitle = (item: (typeof history)[number]) => {
    const first = item.messages?.find((m) => m.role === 'user')?.content || item.messages?.[0]?.content;
    const raw = (first || 'Cuộc trò chuyện').trim();
    return raw.length > 40 ? `${raw.slice(0, 40)}…` : raw;
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      <div className={styles.actionGroup}>
        <button className={styles.actionBtn} onClick={startNewChat} title="Đoạn chat mới">
          <span className={styles.actionIcon}><GoPlus /></span>
          {!collapsed && <span>Đoạn chat mới</span>}
        </button>

        <button
          className={styles.actionBtn}
          onClick={() => setSearchOpen(true)}
          title="Tìm kiếm đoạn chat"
        >
          <span className={styles.actionIcon}><IoIosSearch /></span>
          {!collapsed && <span>Tìm kiếm đoạn chat</span>}
        </button>
      </div>

      <div className={styles.historyList}>
        {history.length === 0 ? (
          <div className={styles.emptyState}>{collapsed ? '…' : 'Chưa có đoạn chat'}</div>
        ) : (
          Object.entries(grouped).map(([label, items]) => (
            <div key={label} className={styles.group}>
              {!collapsed && <div className={styles.groupLabel}>{label}</div>}
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadHistorySession(item.id)}
                  className={`${styles.historyItem} ${
                    selectedHistoryId === item.id ? styles.active : ''
                  }`}
                  title={chatTitle(item)}
                >
                  {!collapsed ? chatTitle(item) : '•'}
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      {user && (
        <div className={styles.userBar}>
          <button
            className={styles.userBtn}
            onClick={() => setUserMenuOpen(true)}
            title={user.email || 'Người dùng'}
          >
            <div className={styles.avatar}>
              {(user.email || '?').slice(0, 1).toUpperCase()}
            </div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <div className={styles.userName}>{(user.email || '').split('@')[0] || 'User'}</div>
                <div className={styles.userEmail}>{user.email || 'Chưa có email'}</div>
              </div>
            )}
          </button>
        </div>
      )}

      <SearchModal
        open={searchOpen}
        history={history}
        onClose={() => setSearchOpen(false)}
        onNewChat={() => {
          startNewChat();
          setSearchOpen(false);
        }}
        onPick={(id) => loadHistorySession(id)}
      />

      {user && (
        <UserMenu
          open={userMenuOpen}
          user={user}
          onClose={() => setUserMenuOpen(false)}
          onLogout={() => {
            setUserMenuOpen(false);
            logout();
          }}
        />
      )}
    </aside>
  );
};
