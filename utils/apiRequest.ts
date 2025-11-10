// utils/apiRequest.ts

import { getLocalStorage, setLocalStorage } from "./localStorage";

export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  customHeaders?: Record<string, string>
): Promise<T> {
  const authToken = getLocalStorage('authToken');
  const refreshToken = getLocalStorage('refreshToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...(refreshToken ? { 'x-refresh-token': refreshToken } : {}),
    ...customHeaders,
  };

  const res = await fetch(endpoint, {
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  });

  // Update tokens if present in response headers
  const newAuthToken = res.headers.get('authorization')?.replace('Bearer ', '');
  const newRefreshToken = res.headers.get('x-refresh-token');
  if (newAuthToken) setLocalStorage('authToken', newAuthToken);
  if (newRefreshToken) setLocalStorage('refreshToken', newRefreshToken);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API error');
  return data;
}
