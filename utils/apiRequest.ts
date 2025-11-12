// utils/apiRequest.ts

import { getLocalStorage, setLocalStorage } from "./localStorage";
import 'dotenv/config';
export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  customHeaders?: Record<string, string>
): Promise<T> {
  const authToken = getLocalStorage('authToken');
  const refreshToken = getLocalStorage('refreshToken');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
    ...(refreshToken ? { 'x-refresh-token': refreshToken } : {}),
    ...customHeaders,
  };

  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  });

  // Update tokens if present in response headers
  const newAuthToken = res.headers.get('authorization')?.replace('Bearer ', '');
  const newRefreshToken = res.headers.get('x-refresh-token');
  if (newAuthToken) setLocalStorage('authToken', newAuthToken);
  if (newRefreshToken) setLocalStorage('refreshToken', newRefreshToken);
  let data: any = null;
  try{
    data = await res.json();
  }
  catch(e){
    data = {error: e};
  }
  
  // if (!res.ok) throw new Error(data?.error || 'API error');
  return data;
}
