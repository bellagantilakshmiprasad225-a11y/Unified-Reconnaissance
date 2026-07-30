export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  organization?: string;
  profileImage?: string;
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
}

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  organization?: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ProfileUpdateData {
  fullName?: string;
  role?: string;
  organization?: string;
  profileImage?: string;
}

export interface AuthProvider {
  signIn(data: LoginData): Promise<AuthUser>;
  signUp(data: SignUpData): Promise<AuthUser>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateProfile(userId: string, data: ProfileUpdateData): Promise<AuthUser>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  getCurrentSession(): Promise<AuthUser | null>;
}
