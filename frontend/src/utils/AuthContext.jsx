import { useEffect, useState } from "react";
import { isAuthenticated, logout, ensureFreshAccessToken } from "./authUtils";
import AuthContext from "./AuthContextObject";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await ensureFreshAccessToken();
        if (token) {
          setIsLoggedIn(true);
          return;
        }
        const authenticated = isAuthenticated();
        setIsLoggedIn(authenticated);
        if (!authenticated) {
          logout();
        }
      } catch (err) {
        console.error("Auth init failed:", err);
        setIsLoggedIn(false);
        logout();
      }
    };

    initAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout: handleLogout, login: handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
