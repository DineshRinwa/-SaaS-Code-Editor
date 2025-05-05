import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    isLoading: false,
    error: null,
  });
  
  // Use a ref to store active requests for cleanup
  const activeRequests = useRef(new Map());

  // Initialize auth state from localStorage
  useEffect(() => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    const storedUser = localStorage.getItem("auth");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setState((prev) => ({
          ...prev,
          user: parsedUser,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("auth");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
    
    // Cleanup function for component unmount
    return () => {
      // Cancel any pending requests when component unmounts
      activeRequests.current.forEach((controller) => {
        try {
          controller.abort();
        } catch (e) {
          console.error("Error aborting request:", e);
        }
      });
    };
  }, []);

  const clearAuth = useCallback(() => {
    setState((prev) => ({ ...prev, user: null, error: null }));
    localStorage.removeItem("auth");
  }, []);

  const apiRequest = useCallback(
    async (endpoint, options = {}) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Create AbortController for this request
      const controller = new AbortController();
      const requestId = Date.now().toString();
      activeRequests.current.set(requestId, controller);
      
      // Add timeout if specified
      const timeout = options.timeout || 30000; // 30 second default timeout
      const timeoutId = setTimeout(() => {
        controller.abort();
        activeRequests.current.delete(requestId);
      }, timeout);

      try {
        // Ensure headers are correctly structured
        const headers = {
          "Content-Type": "application/json",
          ...(state.user?.token && {
            Authorization: `Bearer ${state.user.token}`,
          }),
          ...(options.headers || {}),
        };

        const res = await fetch(`${import.meta.env.VITE_API}/api/auth${endpoint}`, {
          credentials: "include",
          headers,
          signal: controller.signal,
          ...options,
          // Prevent options from overriding our signal
          ...(options.signal ? {} : { signal: controller.signal }),
        });

        // Handle response status
        if (!res.ok) {
          // Get error message from response if possible
          let errorMessage;
          try {
            const errorData = await res.json();
            errorMessage =
              errorData.message || `Request failed with status ${res.status}`;
          } catch (e) {
            errorMessage = `Request failed with status ${res.status}`;
          }

          // Handle specific error statuses
          if (res.status === 401) {
            clearAuth();
            throw new Error(
              errorMessage || "Session expired. Please login again."
            );
          }

          throw new Error(errorMessage);
        }

        return await res.json();
      } catch (error) {
        // Only log and set error if not aborted
        if (error.name !== 'AbortError') {
          console.error(`API Error (${endpoint}):`, error);
          setState((prev) => ({ ...prev, error: error.message }));
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
        activeRequests.current.delete(requestId);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [state.user?.token, clearAuth]
  );

  const persistUser = useCallback((user) => {
    setState((prev) => ({ ...prev, user, error: null }));
    localStorage.setItem("auth", JSON.stringify(user));
  }, []);

  const signup = useCallback(
    async (userData) => {
      try {
        const response = await apiRequest("/signup", {
          method: "POST",
          body: JSON.stringify(userData),
        });

        if (response && response.user) {
          persistUser(response.user);
          return response.user;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Signup error:", error);
        }
        throw error;
      }
    },
    [apiRequest, persistUser]
  );

  const login = useCallback(
    async (credentials) => {
      try {
        const response = await apiRequest("/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });

        if (response && response.user) {
          persistUser(response.user);
          return response.user;
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Login error:", error);
        }
        throw error;
      }
    },
    [apiRequest, persistUser]
  );

  const logout = useCallback(async () => {
    try {
      await apiRequest("/logout", { 
        method: "POST",
        timeout: 5000 // Shorter timeout for logout
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Logout API call failed, clearing locally anyway");
      }
    } finally {
      clearAuth();
    }
  }, [apiRequest, clearAuth]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo(
    () => ({
      user: state.user,
      isLoading: state.isLoading,
      error: state.error,
      isAuthenticated: !!state.user,
      signup,
      login,
      logout,
      apiRequest,
      clearError,
    }),
    [
      state.user,
      state.isLoading,
      state.error,
      signup,
      login,
      logout,
      apiRequest,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;