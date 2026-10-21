import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FontTheme } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  theme: FontTheme;
  setTheme: (theme: FontTheme) => void;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  register: (name: string, email: string, pass: string, avatar?: string) => { success: boolean; message?: string };
  guestLogin: () => void;
  logout: () => void;
  toggleFavorite: (toolId: string) => void;
  recordToolUsage: (toolId: string) => void;
  updateAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'multy_tools_current_user';
const STORAGE_KEY_USERS_DB = 'multy_tools_registered_users';
const STORAGE_KEY_THEME = 'multy_tools_selected_theme';

export const AVATAR_OPTIONS = [
  '⚡', '🚀', '🎨', '🔥', '💎', '🦄', '⭐', '🦁', '🦊', '👾', '🌈', '🔮'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [theme, setThemeState] = useState<FontTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as FontTheme;
      return saved || 'rainbow';
    } catch {
      return 'rainbow';
    }
  });

  const setTheme = (newTheme: FontTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY_THEME, newTheme);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const getUsersDB = (): Record<string, { user: User; pass: string }> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USERS_DB);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveUsersDB = (db: Record<string, { user: User; pass: string }>) => {
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(db));
  };

  const register = (name: string, email: string, pass: string, avatar = '🚀') => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass || !name.trim()) {
      return { success: false, message: 'Please fill in all required fields.' };
    }
    const db = getUsersDB();
    if (db[cleanEmail]) {
      return { success: false, message: 'An account with this email already exists. Please log in.' };
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      avatar,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      savedFavorites: ['image-to-pdf', 'video-downloader', 'pdf-to-word'],
      recentTools: ['image-to-pdf']
    };

    db[cleanEmail] = { user: newUser, pass };
    saveUsersDB(db);
    setUser(newUser);
    return { success: true };
  };

  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const db = getUsersDB();
    const entry = db[cleanEmail];

    if (!entry) {
      return { success: false, message: 'Account not found. Please register first or use Guest Login!' };
    }
    if (entry.pass !== pass) {
      return { success: false, message: 'Invalid password. Please try again.' };
    }

    setUser(entry.user);
    return { success: true };
  };

  const guestLogin = () => {
    const guestUser: User = {
      id: 'guest_' + Date.now().toString().slice(-4),
      name: 'Speed Explorer',
      email: 'guest@multytools.app',
      avatar: '⚡',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      savedFavorites: ['image-to-pdf', 'video-downloader', 'pdf-to-excel', 'qr-studio'],
      recentTools: ['image-to-pdf', 'video-downloader']
    };
    setUser(guestUser);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleFavorite = (toolId: string) => {
    if (!user) return;
    const isFav = user.savedFavorites.includes(toolId);
    const updatedFavs = isFav
      ? user.savedFavorites.filter(id => id !== toolId)
      : [...user.savedFavorites, toolId];

    const updatedUser = { ...user, savedFavorites: updatedFavs };
    setUser(updatedUser);

    // Sync with usersDB if not guest
    const db = getUsersDB();
    if (db[user.email]) {
      db[user.email].user = updatedUser;
      saveUsersDB(db);
    }
  };

  const recordToolUsage = (toolId: string) => {
    if (!user) return;
    const filtered = user.recentTools.filter(id => id !== toolId);
    const updatedRecents = [toolId, ...filtered].slice(0, 8);
    const updatedUser = { ...user, recentTools: updatedRecents };
    setUser(updatedUser);

    const db = getUsersDB();
    if (db[user.email]) {
      db[user.email].user = updatedUser;
      saveUsersDB(db);
    }
  };

  const updateAvatar = (avatar: string) => {
    if (!user) return;
    const updatedUser = { ...user, avatar };
    setUser(updatedUser);

    const db = getUsersDB();
    if (db[user.email]) {
      db[user.email].user = updatedUser;
      saveUsersDB(db);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        theme,
        setTheme,
        login,
        register,
        guestLogin,
        logout,
        toggleFavorite,
        recordToolUsage,
        updateAvatar
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
