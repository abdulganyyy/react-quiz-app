const AUTH_KEY = "auth_user_v1";

export function saveAuthUser(username) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username }));
  } catch {
    // ignore (localStorage bisa gagal di private mode / permission)
  }
}

export function loadAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuthUser() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
}