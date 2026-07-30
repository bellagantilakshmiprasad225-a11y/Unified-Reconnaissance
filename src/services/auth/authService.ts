import type {
  AuthProvider,
  AuthUser,
  LoginData,
  SignUpData,
  ProfileUpdateData,
} from './authTypes';

const USERS_STORAGE_KEY = 'osint_registered_users';
const SESSION_STORAGE_KEY = 'osint_active_session';
const REMEMBER_STORAGE_KEY = 'osint_remember_me';

const DEFAULT_DEMO_USER: AuthUser = {
  id: 'user-demo-001',
  fullName: 'Lakshmiprasad',
  email: 'demo@unifiedrecon.local',
  role: 'Cyber Security Intern',
  organization: 'Enterprise SOC & OSINT Lab',
  createdAt: '2026-07-30T00:00:00Z',
};

const DEFAULT_DEMO_PASSWORD_HASH = 'Demo@12345'; // Demo validation check

interface StoredUserAccount {
  user: AuthUser;
  passwordHash: string;
}

class LocalDemoAuthProvider implements AuthProvider {
  private getStoredUsers(): StoredUserAccount[] {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      if (!raw) {
        // Initialize default demo account
        const initial: StoredUserAccount[] = [
          {
            user: DEFAULT_DEMO_USER,
            passwordHash: DEFAULT_DEMO_PASSWORD_HASH,
          },
        ];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return [{ user: DEFAULT_DEMO_USER, passwordHash: DEFAULT_DEMO_PASSWORD_HASH }];
    }
  }

  private saveStoredUsers(users: StoredUserAccount[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  async signIn(data: LoginData): Promise<AuthUser> {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = this.getStoredUsers();

    const account = users.find(
      (u) => u.user.email.toLowerCase() === cleanEmail && u.passwordHash === data.password
    );

    if (!account) {
      throw new Error('Invalid email or password.');
    }

    // Persist active session
    const storageTarget = data.rememberMe ? localStorage : sessionStorage;
    storageTarget.setItem(SESSION_STORAGE_KEY, JSON.stringify(account.user));
    if (data.rememberMe) {
      localStorage.setItem(REMEMBER_STORAGE_KEY, 'true');
    }

    return account.user;
  }

  async signUp(data: SignUpData): Promise<AuthUser> {
    const cleanEmail = data.email.trim().toLowerCase();
    const users = this.getStoredUsers();

    const existing = users.find((u) => u.user.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      email: cleanEmail,
      role: data.role.trim() || 'Security Analyst',
      organization: data.organization?.trim() || 'OSINT Research Group',
      createdAt: new Date().toISOString(),
    };

    users.push({
      user: newUser,
      passwordHash: data.password,
    });

    this.saveStoredUsers(users);

    // Auto sign-in
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_STORAGE_KEY);
  }

  async resetPassword(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getStoredUsers();
    const account = users.find((u) => u.user.email.toLowerCase() === cleanEmail);

    if (!account) {
      // Return cleanly to avoid account enumeration disclosure
      return;
    }
  }

  async updateProfile(userId: string, data: ProfileUpdateData): Promise<AuthUser> {
    const users = this.getStoredUsers();
    const index = users.findIndex((u) => u.user.id === userId);

    if (index === -1) {
      throw new Error('User profile not found.');
    }

    const updatedUser: AuthUser = {
      ...users[index].user,
      fullName: data.fullName ? data.fullName.trim() : users[index].user.fullName,
      role: data.role ? data.role.trim() : users[index].user.role,
      organization: data.organization !== undefined ? data.organization.trim() : users[index].user.organization,
      profileImage: data.profileImage !== undefined ? data.profileImage : users[index].user.profileImage,
    };

    users[index].user = updatedUser;
    this.saveStoredUsers(users);

    // Update active session memory
    if (localStorage.getItem(SESSION_STORAGE_KEY)) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem(SESSION_STORAGE_KEY)) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    return updatedUser;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const users = this.getStoredUsers();
    const index = users.findIndex((u) => u.user.id === userId);

    if (index === -1) {
      throw new Error('User account not found.');
    }

    if (users[index].passwordHash !== oldPassword) {
      throw new Error('Current password does not match.');
    }

    users[index].passwordHash = newPassword;
    this.saveStoredUsers(users);
  }

  async getCurrentSession(): Promise<AuthUser | null> {
    try {
      const sessionRaw =
        localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionRaw) return null;
      return JSON.parse(sessionRaw);
    } catch {
      return null;
    }
  }
}

export const authService: AuthProvider = new LocalDemoAuthProvider();
