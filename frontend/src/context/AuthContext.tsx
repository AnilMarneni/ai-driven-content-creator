"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    email: string;
    full_name: string;
    avatar_url: string;
    bio: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    updateProfile: () => { }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for token on mount
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await fetch("http://127.0.0.1:8000/auth/me", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (err) {
                    console.error("Auth check failed", err);
                    localStorage.removeItem("token");
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem("token", token);
        // Set cookie for Middleware (expires in 7 days)
        document.cookie = `auth_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        setUser(userData);
        router.push("/");
    };

    const logout = () => {
        localStorage.removeItem("token");
        // Remove cookie
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setUser(null);
        router.push("/login"); // Redirect to login
    };

    const updateProfile = (updated: Partial<User>) => {
        if (user) {
            setUser({ ...user, ...updated });
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
