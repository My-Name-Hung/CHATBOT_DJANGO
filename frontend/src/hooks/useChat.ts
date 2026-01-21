import { useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../services/api';
import type { Message, ChatHistory } from '../utils/types';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.get<ChatHistory[]>('/history/list');
      setHistory(data);
    } catch (error) {
      console.error('Lỗi tải lịch sử:', error);
    }
  };

  const loadHistorySession = async (historyId: string) => {
    try {
      const data = await api.get<ChatHistory>(`/history/${historyId}`);
      setMessages(data.messages || []);
      setSelectedHistoryId(historyId);
    } catch (error) {
      console.error('Lỗi tải phiên chat:', error);
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // Hủy request trước nếu có
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await api.post<{ response: string; historyId?: string }>(
        '/chat/query',
        { message: content.trim() },
        { signal: abortControllerRef.current.signal }
      );

      const aiMessage: Message = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Tải lại lịch sử sau khi gửi tin nhắn
      await loadHistory();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Lỗi gửi tin nhắn:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [loading]);

  const clearHistory = async () => {
    try {
      await api.delete('/history/clear');
      setHistory([]);
      setMessages([]);
      setSelectedHistoryId(null);
    } catch (error) {
      console.error('Lỗi xóa lịch sử:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSelectedHistoryId(null);
  };

  return {
    messages,
    loading,
    history,
    selectedHistoryId,
    sendMessage,
    loadHistorySession,
    clearHistory,
    startNewChat,
  };
};
