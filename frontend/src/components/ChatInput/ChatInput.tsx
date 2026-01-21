import type { KeyboardEvent } from 'react';
import { useMemo, useRef, useState } from 'react';

import { FaArrowUp } from 'react-icons/fa';
import { MdAttachFile } from 'react-icons/md';
import { useChat } from '../../hooks/useChat';
import styles from './ChatInput.module.css';

export const ChatInput = () => {
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { sendMessage, loading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filesLabel = useMemo(() => {
    if (files.length === 0) return '';
    if (files.length === 1) return files[0].name;
    return `${files.length} tệp`;
  }, [files]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    const message = input.trim();
    setInput('');
    setFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    const attachmentHint =
      files.length > 0
        ? `\n\n[Tệp đính kèm: ${files.map((f) => f.name).join(', ')}]`
        : '';
    await sendMessage(`${message}${attachmentHint}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  return (
    <div className={styles.chatInput}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn của bạn... (Enter để gửi, Shift+Enter để xuống dòng)"
          className={styles.textarea}
          rows={1}
          disabled={loading}
        />

        <button
          type="button"
          className={styles.plusButton}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Thêm ảnh và tệp"
        >
          +
        </button>

        {menuOpen && (
          <div className={styles.plusMenu}>
            <button
              type="button"
              className={styles.menuItem}
              onClick={() => {
                setMenuOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <MdAttachFile size={18} />
              <span>Thêm ảnh và tệp</span>
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className={styles.hiddenFile}
          multiple
          onChange={(e) => {
            const list = Array.from(e.target.files || []);
            setFiles(list);
            e.target.value = '';
          }}
        />

        {filesLabel && <div className={styles.filePill} title={files.map((f) => f.name).join('\n')}>{filesLabel}</div>}

        <button
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className={styles.sendButton}
          aria-label="Gửi"
        >
          <FaArrowUp size={18} />
        </button>
      </div>
    </div>
  );
};
