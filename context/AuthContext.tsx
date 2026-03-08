"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User  } from '@prisma/client';
import { logoutAction } from '@/app/action/logout';

type SafeUser = Omit<User, 'password'>;

interface AuthContextType {
    user: SafeUser | null;
    login: (userData: SafeUser) => void;
    logout: () => void;
    isLoading: boolean;
}

// 🚩 ต้อง export ตัวนี้เพื่อให้ useAuth เรียกใช้ได้
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
    children,
    initialUser = null
}: {
    children: ReactNode,
    initialUser?: SafeUser | null
}) {
    const [user, setUser] = useState<SafeUser | null>(initialUser);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("nisit_user");
        if (savedUser && !user) { // ถ้าใน localStorage มี แต่ใน State ไม่มี (เช่นตอน Refresh)
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error("Auth: Failed to parse user", error);
                localStorage.removeItem("nisit_user");
            }
        }
        setIsLoading(false);
    }, [user]);

    const login = (userData: SafeUser) => {
        setUser(userData);
        
        localStorage.setItem("nisit_user", JSON.stringify(userData));
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutAction();
            setUser(null);
            localStorage.removeItem("nisit_user");

        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setIsLoading(false);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 🟢 Custom Hook สำหรับเรียกใช้ใน Client Components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}