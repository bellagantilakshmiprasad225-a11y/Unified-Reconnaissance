# Unified Reconnaissance Dashboard — Authentication System Documentation

## Architecture Overview

The **Unified Reconnaissance Dashboard** incorporates a modular, enterprise-grade authentication system designed to handle identity management, session tracking, protected route guarding, and user data isolation.

```text
Application Start
       ↓
Check Session (useAuthStore)
       ↓
 ┌───────────────┐
 │ Authenticated?│
 └───────┬───────┘
         │
     ┌───┴────┐
     │        │
    YES       NO
     │        │
     ▼        ▼
Dashboard   Login / Sign Up / Recovery
              │
       ┌──────┴──────┐
       │             │
     Login         Sign Up
       │             │
       └──────┬──────┘
              ▼
          Dashboard
```

---

## Service Layer Abstraction (`AuthProvider`)

Authentication logic is decoupled from UI components using the `AuthProvider` interface defined in `src/services/auth/authTypes.ts`:

```typescript
export interface AuthProvider {
  signIn(data: LoginData): Promise<AuthUser>;
  signUp(data: SignUpData): Promise<AuthUser>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateProfile(userId: string, data: ProfileUpdateData): Promise<AuthUser>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
  getCurrentSession(): Promise<AuthUser | null>;
}
```

### Active Provider: `LocalDemoAuthProvider`
For client-side presentation and offline internship demonstrations, the active provider implementation is `LocalDemoAuthProvider` (`src/services/auth/authService.ts`).

- **Demo Credentials**:
  - **Email**: `demo@unifiedrecon.local`
  - **Password**: `Demo@12345`
  - **Role**: Cyber Security Intern
  - **Organization**: Enterprise SOC & OSINT Lab

> [!CAUTION]
> **Production Identity Disclaimer**: `LocalDemoAuthProvider` stores accounts and sessions locally in browser storage for demonstration purposes only. When deploying to a production SOC environment, swap `authService` with an enterprise backend provider (e.g., Firebase Auth, Auth0, Supabase, OAuth2, or custom OpenID Connect gateway).

---

## Authentication Components & Pages

| Component / Page | Location | Description |
| :--- | :--- | :--- |
| `AuthLayout` | `src/components/auth/AuthLayout.tsx` | Responsive 2-column SOC branded layout with dark theme & security notice. |
| `PasswordField` | `src/components/auth/PasswordField.tsx` | Password input with Lucide `Eye` / `EyeOff` show/hide toggle. |
| `PasswordStrength` | `src/components/auth/PasswordStrength.tsx` | Dynamic strength meter (Weak / Medium / Strong) verifying length, case, & numbers. |
| `UserProfileModal` | `src/components/auth/UserProfileModal.tsx` | Interactive modal to update analyst profile metadata, upload avatar, & change password. |
| `Login` | `src/pages/Login.tsx` | Login screen with email/password validation, Remember Me, & Demo Quick-Fill button. |
| `SignUp` | `src/pages/SignUp.tsx` | Account creation with role selection, organization field, & mandatory ethical terms checkbox. |
| `ForgotPassword` | `src/pages/ForgotPassword.tsx` | Recovery UI request form with demo notice. |
| `ResetPassword` | `src/pages/ResetPassword.tsx` | Password replacement interface with strength validation. |

---

## Security Boundaries & User Data Isolation

1. **No Plaintext Passwords in UI / Logs**: Passwords are validated securely and never logged to console or URL parameters.
2. **User Data Scoping (`userId`)**: All domain objects (`Investigation`, `TargetProfile`, `Evidence`, `SearchRecord`, `FavoriteItem`, `Note`) contain a `userId` field to ensure workspace isolation.
3. **Protected Routes**: Navigation to `/dashboard`, `/investigations`, `/targets`, `/tools`, `/evidence`, `/reports`, `/history`, `/favorites`, or `/settings` is strictly guarded by `useAuthStore.isAuthenticated`.
