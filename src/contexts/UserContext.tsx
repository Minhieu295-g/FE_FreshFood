import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import {UserAccount} from "../types/login";

interface User {
    username: string;
    fullName: string;
    userId: number;
    cartId: number;
}

interface UserContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (loginData: UserAccount) => Promise<void>;
    logout: () => void;
    handleGoogleCallback: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = async (loginData: UserAccount) => {
        try {
            const response = await axios.post("http://localhost:80/auth/access", loginData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // Gửi kèm cookie
            });

            if (response.data.status === 200) {
                setUser(response.data.data);
                setIsLoggedIn(true);
                localStorage.setItem("user", JSON.stringify(response.data.data));
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post("http://localhost:80/auth/refresh", {}, { withCredentials: true });

            if (response.data.status === 200) {
                setUser(response.data.data);
                setIsLoggedIn(true);
                localStorage.setItem("user", JSON.stringify(response.data.data));
            } else {
                logout();
            }
        } catch (error) {
            console.error("Refresh token thất bại, đăng xuất...");
            logout();
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem("user");
        axios.post("http://localhost:80/auth/logout", {}, { withCredentials: true }).catch(console.error);
    };

    // Khi tải lại trang, thực hiện refresh token
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            refreshToken();
        }
    }, []);

    const handleGoogleCallback = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get("user");
        if (!userParam) return;
        console.log("da vao day: " + userParam)
        if (userParam) {
            try {
                const decodedUser = decodeURIComponent(userParam);
                const user = JSON.parse(decodedUser);
                setUser(user);
                setIsLoggedIn(true);
                localStorage.setItem("user", JSON.stringify(user));
                console.log("da xet local storage " + user.username)
                // Xóa tham số khỏi URL để tránh lỗi reload lại trang
                window.history.replaceState({}, document.title, "/");
            } catch (error) {
                console.error("Lỗi xử lý dữ liệu user từ Google Callback", error);
            }
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoggedIn, login, logout, handleGoogleCallback }}>
            {children}
        </UserContext.Provider>
    );
};
