import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../services/supabase.jsx';
import { validateUsername, validatePassword } from '../utils/validation.jsx';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (email, password, username) => {
    if (!validateUsername(username)) {
      throw new Error('Username must be at least 5 characters (letters only)');
    }
    
    if (!validatePassword(password)) {
      throw new Error('Password must be at least 5 characters with alpha, numeric, and one of $, %, *, @');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) throw error;
    
    setUser(data.user);
    setUserRole('player');
    
    return data;
  };

const signIn = async (email, password, requireAdmin = false) => {
  // Sign in with Supabase auth first
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error('Invalid credentials');
  
  // After successful auth, get user role from users table
  if (data.user) {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (userError) throw new Error('User profile not found');

    // Check if admin login is required but user is not admin
    if (requireAdmin && userData.role !== 'admin') {
      await supabase.auth.signOut(); // Sign them out
      throw new Error('Access Denied: Admin credentials required.');
    }

    setUser(data.user);
    setUserRole(userData.role);
  }
  
  return data;
};
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserRole(null);
  };

  const value = {
    user,
    userRole,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}