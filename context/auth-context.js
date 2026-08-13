"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    signInWithGoogle,
    logout as logoutUser,
    onAuthStateChange
} from "@/utils/google-auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const isAdmin = user?.email === "ankitkaushik6269@gmail.com";

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                isAuthenticated: !!user,
                isAdmin
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
