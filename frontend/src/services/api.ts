const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() || 'http://localhost:8080';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const data = (await resp.json().catch(() => ({}))) as unknown;

  if (!resp.ok) {
    const message =
      typeof (data as any)?.message === 'string'
        ? (data as any).message
        : 'Có lỗi xảy ra.';
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  get<T>(path: string, init?: RequestInit): Promise<T> {
    return request<T>(path, { ...init, method: 'GET' });
  },

  post<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...init,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put<T>(path: string, body?: any, init?: RequestInit): Promise<T> {
    return request<T>(path, {
      ...init,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete<T>(path: string, init?: RequestInit): Promise<T> {
    return request<T>(path, { ...init, method: 'DELETE' });
  },
};
