"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@prisma/client';
import { logoutAction } from '@/app/action/logout';

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

// 🚩 ต้อง export ตัวนี้เพื่อให้ useAuth เรียกใช้ได้
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
    children,
    initialUser
}: {
    children: ReactNode,
    initialUser: User | null
}) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState(false);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutAction();
            setUser(null);

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