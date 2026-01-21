import { useEffect, useMemo, useState } from 'react';

import type { ChatHistory } from '../../utils/types';
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

function chatTitle(item: ChatHistory): string {
  const first = item.messages?.find((m) => m.role === 'user')?.content || item.messages?.[0]?.content;
  const raw = (first || 'Cuộc trò chuyện').trim();
  return raw.length > 48 ? `${raw.slice(0, 48)}…` : raw;
}

type Props = {
  open: boolean;
  history: ChatHistory[];
  onClose: () => void;
  onNewChat: () => void;
  onPick: (historyId: string) => void;
};

export const SearchModal = ({ open, history, onClose, onNewChat, onPick }: Props) => {
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) return;
    setQ('');
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return history;
    return history.filter((h) => chatTitle(h).toLowerCase().includes(query));
  }, [history, q]);

  const groups = useMemo(() => {
    const out: Record<string, ChatHistory[]> = {};
    for (const h of filtered) {
      const label = groupLabel(new Date(h.createdAt));
      out[label] = out[label] || [];
      out[label].push(h);
    }
    return out;
  }, [filtered]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.searchModal}>
        <div className={styles.searchHeader}>
          <input
            className={styles.searchInput}
            placeholder="Tìm kiếm đoạn chat…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <button className={styles.iconBtn} onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <button className={styles.searchNewChat} onClick={onNewChat}>
          <span className={styles.actionIcon}>＋</span>
          <span>Đoạn chat mới</span>
        </button>

        <div className={styles.searchList}>
          {Object.keys(groups).length === 0 ? (
            <div className={styles.searchEmpty}>Không có kết quả.</div>
          ) : (
            Object.entries(groups).map(([label, items]) => (
              <div key={label} className={styles.group}>
                <div className={styles.groupLabel}>{label}</div>
                {items.map((it) => (
                  <button
                    key={it.id}
                    className={styles.searchItem}
                    onClick={() => {
                      onPick(it.id);
                      onClose();
                    }}
                    title={chatTitle(it)}
                  >
                    {chatTitle(it)}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

