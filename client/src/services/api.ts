import { User, Camp, Registration, ChatMessage, BodyDoublingSession, LivePaymentInfo, LiveSession } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  };

  // If body is FormData, delete Content-Type so the browser sets the multipart boundary properly
  if (options.body instanceof FormData) {
    delete (config.headers as Record<string, string>)['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data as T;
}

// Auth API
export const authApi = {
  register: (body: any) => request<{ success: boolean; user: User; message: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  login: (body: any) => request<{ success: boolean; user: User; message: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  adminLogin: (body: { username: string; password: string }) => request<{ success: boolean; user: User; message: string }>('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  me: () => request<{ success: boolean; user: User }>('/auth/me', { method: 'GET' }),
  logout: () => request<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),
  forgotPassword: (email: string) => request<{ success: boolean; message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  resetPassword: (body: any) => request<{ success: boolean; message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(body),
  }),
};

// Camps API
export const campApi = {
  getInfo: () => request<{ success: boolean; camp: Camp }>('/camps/info', { method: 'GET' }),
  register: (formData: FormData) => request<{ success: boolean; registration: Registration; message: string }>('/camps/register', {
    method: 'POST',
    body: formData,
  }),
  getMyRegistrations: () => request<{ success: boolean; registrations: Registration[] }>('/camps/my-registrations', { method: 'GET' }),
  cancelRegistration: (id: string, reason: string) => request<{ success: boolean; message: string }>(`/camps/my-registrations/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
};

// Admin API
export const adminApi = {
  getRegistrations: (status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    return request<{ success: boolean; total: number; campCapacity: number; registrations: any[] }>(`/admin/registrations?${params.toString()}`);
  },
  verifyPayment: (id: string) => request<{ success: boolean; message: string; registration: any }>(`/admin/registrations/${id}/verify`, {
    method: 'POST',
  }),
  rejectPayment: (id: string, reason: string) => request<{ success: boolean; message: string; registration: any }>(`/admin/registrations/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  cancelRegistration: (id: string, reason: string) => request<{ success: boolean; message: string; registration: any }>(`/admin/registrations/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
  getStats: () => request<{ success: boolean; stats: any }>('/admin/stats'),
  updateCampConfig: (body: any) => request<{ success: boolean; message: string; camp: any }>('/admin/camp-config', {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
};

// AI Companion API
export const aiApi = {
  sendMessage: (message: string) => request<{
    success: boolean;
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
    crisisHelplineTriggered?: boolean;
    suggestedGrounding?: boolean;
  }>('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
  getHistory: () => request<{ success: boolean; messages: ChatMessage[] }>('/ai/history'),
  clearHistory: () => request<{ success: boolean; message: string }>('/ai/history', { method: 'DELETE' }),
};

// Body Doubling API
export const bodyDoublingApi = {
  getActiveSession: () => request<{ success: boolean; session: BodyDoublingSession }>('/body-doubling/active'),
  updateSession: (id: string, body: Partial<BodyDoublingSession>) => request<{ success: boolean; session: BodyDoublingSession }>(`/body-doubling/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  getHistory: () => request<{ success: boolean; sessions: BodyDoublingSession[] }>('/body-doubling/history'),
};

export const liveBodyDoublingApi = {
  getPaymentInfo: () => request<{ success: boolean } & LivePaymentInfo>('/live-body-doubling/payment-info'),
  getEntitlement: () => request<{ success: boolean; approved: boolean; pending: boolean }>('/live-body-doubling/entitlement'),
  submitPayment: (utr: string) => request<{ success: boolean; message: string }>('/live-body-doubling/payments', {
    method: 'POST',
    body: JSON.stringify({ utr }),
  }),
  getActiveSession: () => request<{ success: boolean; session: LiveSession }>('/live-body-doubling/session/active'),
  joinSession: (id: string) => request<{ success: boolean; roomName: string; checklist: BodyDoublingSession | null }>(`/live-body-doubling/session/${id}/join`, { method: 'POST' }),
  leaveSession: (id: string) => request<{ success: boolean }>(`/live-body-doubling/session/${id}/leave`, { method: 'POST' }),
};

export const liveAdminApi = {
  getPayments: () => request<{ success: boolean; payments: any[] }>('/admin/live-body-doubling/payments'),
  approvePayment: (id: string) => request<{ success: boolean; message: string }>(`/admin/live-body-doubling/payments/${id}/approve`, { method: 'POST' }),
  rejectPayment: (id: string, reason: string) => request<{ success: boolean; message: string }>(`/admin/live-body-doubling/payments/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getSessions: () => request<{ success: boolean; sessions: any[] }>('/admin/live-body-doubling/sessions'),
  createSession: () => request<{ success: boolean; session: LiveSession }>('/admin/live-body-doubling/sessions', { method: 'POST' }),
};
