export const DEMO_ID = 'tahmid';
export const DEMO_PASS = '12345678';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthResult {
  user: { name: string; email: string };
  token: string;
}

const USERS_KEY = 'fakeShieldUsers';

const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];

  try {
    const rawUsers = localStorage.getItem(USERS_KEY);
    if (!rawUsers) return [];

    const parsed = JSON.parse(rawUsers);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerLocalUser = (name: string, email: string, password: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getStoredUsers();

  const existingUser = users.find(user => user.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: StoredUser = {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}`,
    name: name.trim() || 'New User',
    email: normalizedEmail,
    password,
  };

  users.push(newUser);
  saveStoredUsers(users);

  return {
    name: newUser.name,
    email: newUser.email,
  };
};

export const authenticateLocalUser = (email: string, password: string): AuthResult | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (normalizedEmail === DEMO_ID && normalizedPassword === DEMO_PASS) {
    return {
      user: { name: DEMO_ID, email: `${DEMO_ID}@fakeshield.ai` },
      token: 'demo-token',
    };
  }

  const users = getStoredUsers();
  const matchedUser = users.find(user => user.email.toLowerCase() === normalizedEmail && user.password === normalizedPassword);

  if (!matchedUser) return null;

  return {
    user: { name: matchedUser.name, email: matchedUser.email },
    token: 'local-token',
  };
};

export const persistAuth = (user: { name: string; email: string }, token: string) => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
