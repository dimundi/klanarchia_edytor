type ApiConfig = { apiUrl: string; nonce: string };
let config: ApiConfig;
export function configureApi(value: ApiConfig) { config = value; }
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
export async function request<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
 const url = new URL(config.apiUrl); url.pathname = url.pathname.replace(/\/bootstrap\/?$/, '/' + path.split('?')[0]);
 const query = path.split('?')[1]; if (query) new URLSearchParams(query).forEach((v, k) => url.searchParams.set(k, v));
 const response = await fetch(url, { method, credentials: 'same-origin', headers: { 'X-WP-Nonce': config.nonce, ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(data === undefined ? {} : { body: JSON.stringify(data) }) });
 const body = await response.json().catch(() => ({}));
 if (!response.ok) throw new ApiError(response.status, body.message || 'Request failed');
 return body as T;
}