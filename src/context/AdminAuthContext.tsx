/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const BOOTSTRAP_ADMIN_EMAIL = 'bangnurworkspace@gmail.com';
const ALLOWED_ADMIN_EMAILS = new Set([
  'bangnurworkspace@gmail.com',
  'admin@sanakgerobak.com',
  'halo@sanakgerobak.com',
]);

const SESSION_COOKIE_NAME = 'sanak_cms_sid';
const CMS_SESSIONS_COLLECTION = 'cms_sessions';

interface CloudSession {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'editor';
  createdAt: string;
  expiresAt: string;
}

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  bootstrapAdminEmail: string;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string, newPassword?: string) => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function getSessionCookieId(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${SESSION_COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function setSessionCookieId(sessionId: string): void {
  if (typeof document === 'undefined') return;
  const maxAgeSeconds = 60 * 60 * 24 * 7; // 7 days
  document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
}

function clearSessionCookieId(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

function createSessionUserView(session: CloudSession): User {
  return {
    uid: session.uid,
    email: session.email,
    displayName: session.displayName,
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [
      {
        providerId: 'password',
        uid: session.uid,
        displayName: session.displayName,
        email: session.email,
        phoneNumber: null,
        photoURL: null,
      },
    ],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => '',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
  };
}

function encodeHash(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return `h_${(hash >>> 0).toString(16)}`;
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isEmailAuthorized = async (cleanEmail: string): Promise<boolean> => {
    if (ALLOWED_ADMIN_EMAILS.has(cleanEmail)) {
      return true;
    }
    try {
      const profileRef = doc(db, 'site_sections', 'admin_profile');
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.allowedEmails) && data.allowedEmails.includes(cleanEmail)) {
          return true;
        }
      }
    } catch {
      // Ignore read error
    }
    return false;
  };

  const checkAdminPrivilege = async (currentUser: User): Promise<boolean> => {
    const cleanEmail = (currentUser.email || '').trim().toLowerCase();
    try {
      if (ALLOWED_ADMIN_EMAILS.has(cleanEmail)) {
        try {
          const adminRef = doc(db, 'admins', currentUser.uid);
          const adminSnap = await getDoc(adminRef);
          if (!adminSnap.exists()) {
            await setDoc(adminRef, {
              uid: currentUser.uid,
              email: cleanEmail,
              role: 'superadmin',
              createdAt: new Date().toISOString(),
            });
          }
        } catch {
          // Proceed even if admin doc already exists or write skipped
        }
        return true;
      }

      const adminRef = doc(db, 'admins', currentUser.uid);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        return data.role === 'superadmin' || data.role === 'editor';
      }

      return false;
    } catch {
      return ALLOWED_ADMIN_EMAILS.has(cleanEmail);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const verified = await checkAdminPrivilege(currentUser);
        setUser(currentUser);
        setIsAdmin(verified);
        setLoading(false);
        return;
      }

      // Check active session stored in Cloud Firestore via opaque session cookie ID
      const sessionId = getSessionCookieId();
      if (sessionId) {
        try {
          const sessionRef = doc(db, CMS_SESSIONS_COLLECTION, sessionId);
          const sessionSnap = await getDoc(sessionRef);
          if (sessionSnap.exists()) {
            const sessionData = sessionSnap.data() as CloudSession;
            const notExpired =
              sessionData.expiresAt && new Date(sessionData.expiresAt).getTime() > Date.now();
            const authorized =
              sessionData.email && (await isEmailAuthorized(sessionData.email.toLowerCase()));

            if (notExpired && authorized) {
              setUser(createSessionUserView(sessionData));
              setIsAdmin(true);
              setLoading(false);
              return;
            }
          }
          clearSessionCookieId();
        } catch {
          clearSessionCookieId();
        }
      }

      setUser(null);
      setIsAdmin(false);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const verifyAndCreateCloudSession = async (cleanEmail: string, pass: string): Promise<void> => {
    const passHash = encodeHash(`${cleanEmail}:${pass}`);
    const credRef = doc(db, 'site_sections', 'admin_credentials');
    const credSnap = await getDoc(credRef);

    if (credSnap.exists()) {
      const data = credSnap.data() as Record<string, string>;
      const existingHash = data?.[cleanEmail];
      if (existingHash && existingHash !== passHash) {
        throw new Error('Email atau kata sandi tidak cocok.');
      }
      if (!existingHash) {
        await setDoc(
          credRef,
          { [cleanEmail]: passHash, updatedAt: new Date().toISOString() },
          { merge: true }
        );
      }
    } else {
      await setDoc(
        credRef,
        { [cleanEmail]: passHash, updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }

    const uid =
      cleanEmail === BOOTSTRAP_ADMIN_EMAIL
        ? 'svJZt6OptUR2GK9DNncOslUJ9ds2'
        : `admin-${encodeHash(cleanEmail)}`;

    const sessionId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const session: CloudSession = {
      uid,
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      role: 'superadmin',
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    await setDoc(doc(db, CMS_SESSIONS_COLLECTION, sessionId), session);
    setSessionCookieId(sessionId);

    setUser(createSessionUserView(session));
    setIsAdmin(true);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !pass) {
      const msg = 'Mohon masukkan alamat email dan kata sandi.';
      setError(msg);
      throw new Error(msg);
    }

    if (pass.length < 6) {
      const msg = 'Kata sandi minimal terdiri dari 6 karakter.';
      setError(msg);
      throw new Error(msg);
    }

    const authorized = await isEmailAuthorized(cleanEmail);
    if (!authorized) {
      const msg = 'Akun email ini tidak terdaftar sebagai Administrator SANAK GEROBAK.';
      setError(msg);
      throw new Error(msg);
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const verified = await checkAdminPrivilege(cred.user);
      if (!verified) {
        await signOut(auth);
        throw new Error('Akun ini tidak memiliki hak akses Administrator SANAK GEROBAK.');
      }
      setUser(cred.user);
      setIsAdmin(true);
      return;
    } catch (signInErr: any) {
      const code = signInErr?.code || '';

      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-login-credentials'
      ) {
        try {
          const created = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
          await checkAdminPrivilege(created.user);
          setUser(created.user);
          setIsAdmin(true);
          return;
        } catch (createErr: any) {
          const createCode = createErr?.code || '';
          if (
            createCode === 'auth/operation-not-allowed' ||
            createCode === 'auth/configuration-not-found' ||
            createCode === 'auth/email-already-in-use' ||
            createCode === 'auth/admin-restricted-operation' ||
            code === 'auth/invalid-credential' ||
            code === 'auth/invalid-login-credentials'
          ) {
            try {
              await verifyAndCreateCloudSession(cleanEmail, pass);
              return;
            } catch (cloudErr: any) {
              const msg = cloudErr?.message || 'Email atau kata sandi tidak cocok.';
              setError(msg);
              throw new Error(msg);
            }
          }
        }
      }

      if (
        code === 'auth/operation-not-allowed' ||
        code === 'auth/configuration-not-found' ||
        code === 'auth/admin-restricted-operation'
      ) {
        try {
          await verifyAndCreateCloudSession(cleanEmail, pass);
          return;
        } catch (cloudErr: any) {
          const msg = cloudErr?.message || 'Gagal memverifikasi kredensial di Cloud Firestore.';
          setError(msg);
          throw new Error(msg);
        }
      }

      let msg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        msg = 'Email atau kata sandi tidak cocok.';
      } else if (code === 'auth/too-many-requests') {
        msg = 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.';
      } else if (signInErr?.message) {
        msg = signInErr.message;
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const verified = await checkAdminPrivilege(cred.user);
      if (!verified) {
        await signOut(auth);
        throw new Error('Akun Google ini tidak terdaftar sebagai Administrator.');
      }
      setUser(cred.user);
      setIsAdmin(true);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Gagal masuk dengan akun Google.');
        throw err;
      }
    }
  };

  const logout = async () => {
    const sessionId = getSessionCookieId();
    clearSessionCookieId();
    if (sessionId) {
      try {
        await deleteDoc(doc(db, CMS_SESSIONS_COLLECTION, sessionId));
      } catch {
        // Ignore cleanup failure
      }
    }
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('[CMS Auth] Logout error:', err);
    }
    setUser(null);
    setIsAdmin(false);
  };

  const resetPassword = async (email: string, newPassword?: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const authorized = await isEmailAuthorized(cleanEmail);
    if (!authorized) {
      const msg = 'Email tersebut tidak terdaftar sebagai Administrator SANAK GEROBAK.';
      setError(msg);
      throw new Error(msg);
    }

    if (newPassword && newPassword.length >= 6) {
      const passHash = encodeHash(`${cleanEmail}:${newPassword}`);
      const credRef = doc(db, 'site_sections', 'admin_credentials');
      await setDoc(
        credRef,
        { [cleanEmail]: passHash, updatedAt: new Date().toISOString() },
        { merge: true }
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch {
      const credRef = doc(db, 'site_sections', 'admin_credentials');
      await setDoc(
        credRef,
        { [cleanEmail]: '', updatedAt: new Date().toISOString() },
        { merge: true }
      );
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        error,
        bootstrapAdminEmail: BOOTSTRAP_ADMIN_EMAIL,
        loginWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
