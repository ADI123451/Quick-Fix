import { createContext, useContext, useEffect, useState } from "react";

// Local-only auth for the demo. Stored in localStorage.
// Users: { [email]: { email, password, name, phone, address } }
// Session: email of currently signed-in user

const USERS_KEY = "qf_users";
const SESSION_KEY = "qf_session";

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch { return {}; }
};
const writeUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem(SESSION_KEY);
    if (email) {
      const u = readUsers()[email.toLowerCase()];
      if (u) setUser({ email: u.email, name: u.name, phone: u.phone, address: u.address });
    }
    setReady(true);
  }, []);

  const signup = ({ email, password, name, phone = "", address = "" }) => {
    const key = email.trim().toLowerCase();
    if (!key || !password || !name) throw new Error("Name, email and password are required");
    const users = readUsers();
    if (users[key]) throw new Error("An account with that email already exists");
    users[key] = { email: key, password, name, phone, address };
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, key);
    setUser({ email: key, name, phone, address });
  };

  const login = ({ email, password }) => {
    const key = email.trim().toLowerCase();
    const users = readUsers();
    const u = users[key];
    if (!u || u.password !== password) throw new Error("Invalid email or password");
    localStorage.setItem(SESSION_KEY, key);
    setUser({ email: u.email, name: u.name, phone: u.phone, address: u.address });
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateProfile = (patch) => {
    if (!user) return;
    const users = readUsers();
    const existing = users[user.email];
    if (!existing) return;
    const updated = { ...existing, ...patch, email: existing.email };
    users[user.email] = updated;
    writeUsers(users);
    setUser({ email: updated.email, name: updated.name, phone: updated.phone, address: updated.address });
  };

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
