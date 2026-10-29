export type User = { id: string; fullName: string; email: string; username: string; role: string };
export type Session = { accessToken: string; refreshToken: string; user: User };
export type Attendance = { id: string; type: 'DAILY' | 'EVENT'; eventId: string | null; checkInAt: string; checkOutAt: string | null; checkInLatitude: number | null; checkInLongitude: number | null; checkOutLatitude: number | null; checkOutLongitude: number | null };
export type EventItem = { id: string; name: string; startAt: string; endAt: string; timeConfirmed: boolean; location: string | null; description: string | null };
export type Assignment = { id: string; status: string; employeeType: { name: string }; event: EventItem };
const key = 'tred-crew-session';
const base = import.meta.env.DEV ? '/api/v1' : (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
export function session(): Session | null { try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; } }
export function setSession(value: Session | null) { if (value) sessionStorage.setItem(key, JSON.stringify(value)); else sessionStorage.removeItem(key); window.dispatchEvent(new Event('crew-session')); }
let refreshing: Promise<Session> | null = null;
async function renew() {
  if (!refreshing) refreshing = (async () => {
    const current = session(); if (!current) throw new Error('Phiên đăng nhập đã hết hạn.');
    const res = await fetch(`${base}/auth/refresh`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({refreshToken:current.refreshToken}) });
    const result = await res.json(); if (!res.ok) { setSession(null); throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'); }
    setSession(result.data); return result.data as Session;
  })().finally(() => { refreshing = null; });
  return refreshing;
}
export async function request<T>(path: string, options: { method?: string; body?: unknown; public?: boolean } = {}): Promise<T> {
  const call = (token?: string) => fetch(`${base}${path}`, { method:options.method || 'GET', headers:{ ...(options.body !== undefined ? {'Content-Type':'application/json'} : {}), ...(token ? {Authorization:`Bearer ${token}`} : {}) }, ...(options.body !== undefined ? {body:JSON.stringify(options.body)} : {}) });
  let res = await call(options.public ? undefined : session()?.accessToken);
  if (res.status === 401 && !options.public && session()) res = await call((await renew()).accessToken);
  let result; try { result = await res.json(); } catch { throw new Error('Không đọc được phản hồi từ máy chủ.'); }
  if (!res.ok) {
    const code = result.error?.code;
    const messages: Record<string,string> = { INVALID_CREDENTIALS:'Thông tin đăng nhập không đúng hoặc tài khoản chưa được duyệt.', ACTIVE_EMPLOYEE_REQUIRED:'Tài khoản chưa được liên kết với hồ sơ nhân sự đang hoạt động. Hãy liên hệ quản trị viên.', EMAIL_ALREADY_EXISTS:'Email này đã được đăng ký.', EVENT_ASSIGNMENT_REQUIRED:'Bạn chưa được giao sự kiện này.', ALREADY_CHECKED_IN:'Bạn đã check-in và chưa check-out.' };
    throw new Error(messages[code] || result.error?.message || `Không thể thực hiện yêu cầu (${res.status}).`);
  }
  return result.data as T;
}
export async function logout() { const current = session(); setSession(null); if (current) await request('/auth/logout',{method:'POST',body:{refreshToken:current.refreshToken},public:true}).catch(() => {}); }
