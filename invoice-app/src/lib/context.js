'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authStore, settingsStore } from './store';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettingsState] = useState(null);
  const [darkMode, setDarkModeState] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate from localStorage
    const u = authStore.getUser();
    const s = settingsStore.get();
    const dark = localStorage.getItem('mg_dark_mode') === 'true';
    setUser(u);
    setSettingsState(s);
    setDarkModeState(dark);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('mg_dark_mode', darkMode);
    }
  }, [darkMode]);

  const login = useCallback((email, password) => {
    const u = authStore.login(email, password);
    if (u) setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authStore.logout();
    setUser(null);
  }, []);

  const updateSettings = useCallback((data) => {
    settingsStore.set(data);
    setSettingsState(settingsStore.get());
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkModeState(prev => !prev);
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout,
      settings, updateSettings,
      darkMode, toggleDarkMode,
      sidebarOpen, setSidebarOpen,
      loading,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
