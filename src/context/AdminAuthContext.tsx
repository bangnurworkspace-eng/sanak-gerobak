/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const BOOTSTRAP_ADMIN_EMAIL = 'bangnurworkspace@gmail.com';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  bootstrapAdminEmail: string;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAdminPrivilege = async (currentUser: User): Promise<boolean> => {
    try {
      // 1. Check bootstrap superadmin email
      if (currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
        // Ensure admin document exists in Firestore
        const adminRef = doc(db, 'admins', currentUser.uid);
        const adminSnap = await getDoc(adminRef);
        if (!adminSnap.exists()) {
          await setDoc(adminRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            role: 'superadmin',
            createdAt: new Date().toISOString(),
          });
        }
        return true;
      }

      // 2. Check Firestore admins collection
      const adminRef = doc(db, 'admins', currentUser.uid);
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        return data.role === 'superadmin' || data.role === 'editor';
      }

      return false;
    } catch (err) {
      console.warn('[SANAK GEROBAK CMS] Admin check failed:', err);
      // Fallback if bootstrap email matches
      if (currentUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
        return true;
      }
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const verified = await checkAdminPrivilege(currentUser);
        setIsAdmin(verified);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const isAuthorized = await checkAdminPrivilege(cred.user);
      if (!isAuthorized) {
        await signOut(auth);
        throw new Error('Akun ini tidak memiliki hak akses Administrator SANAK GEROBAK.');
      }
    } catch (err: any) {
      let msg = 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Email atau kata sandi tidak cocok.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'Pengguna dengan email ini tidak ditemukan.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Terlalu banyak percobaan gagal. Silakan tunggu beberapa menit.';
      } else if (err.message) {
        msg = err.message;
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
      const isAuthorized = await checkAdminPrivilege(cred.user);
      if (!isAuthorized) {
        await signOut(auth);
        throw new Error('Akun Google ini tidak terdaftar sebagai Administrator.');
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Gagal masuk dengan akun Google.');
        throw err;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (err: any) {
      console.error('[CMS Auth] Logout error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim instruksi pemulihan kata sandi.');
      throw err;
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
