import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { tokenStore } from "../services/apiClient.js";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [pendingPhone, setPendingPhone] = useState(() => {
    try { return sessionStorage.getItem("fastor_pending_phone") || ""; } catch { return ""; }
  });

  const sendOtp = useCallback(async (phone) => {
    await authService.requestOtp(phone);
    setPendingPhone(phone);
    try { sessionStorage.setItem("fastor_pending_phone", phone); } catch { /* ignore */ }
  }, []);

  const confirmOtp = useCallback(async (otp) => {
    const { token: newToken } = await authService.verifyOtp(pendingPhone, otp);
    tokenStore.set(newToken);
    setToken(newToken);
    try { sessionStorage.removeItem("fastor_pending_phone"); } catch { /* ignore */ }
  }, [pendingPhone]);

  const logout = useCallback(() => {
    tokenStore.clear();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ token, isAuthenticated: Boolean(token), pendingPhone, sendOtp, confirmOtp, logout }),
    [token, pendingPhone, sendOtp, confirmOtp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
