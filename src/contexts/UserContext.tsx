import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import {UserAccount} from "../types/login";
import api from "../api/api";

interface User {
    username: string;
    fullName: string;
    userId: number;
    cartId: number;
    role: string;
}

interface UserContextType {
    user: User | null;
    isLoggedIn: boolean;
    cartItemQuantity: any;
    login: (loginData: UserAccount) => Promise<void>;
    logout: () => void;
    handleGoogleCallback: () => void;
    getQuantityCartItem: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartItemQuantity, setCartItemQuantity] = useState(0);
    const login = async (loginData: UserAccount) => {
        try {
            const response = await axios.post("http://localhost:80/auth/access", loginData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // Gửi kèm cookie
            });

            if (response.data.status === 200) {
                console.log("data response: ", response.data)
                setUser(response.data.data);
                setIsLoggedIn(true);
                localStorage.setItem("user", JSON.stringify(response.data.data));
                setTimeout(() => getQuantityCartItem(), 100); // Delay để đảm bảo user đã được cập nhật
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
    const getQuantityCartItem = async () =>{
        console.log("da vao day")
        const userData = localStorage.getItem("user");
        if (userData==null){
            return;
        }
        const user = JSON.parse(userData);
        try {
            const response = await api.get(`/cart/get-quantity/${user.cartId}`, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true, // Gửi kèm cookie
            });
            console.log(response.data.data + " oday ne");
            if (response.data.status === 200) {
               setCartItemQuantity(response.data.data)
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
        }
    }

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
            getQuantityCartItem();
        }

    }, []);
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        await refreshToken();
                        return api(originalRequest); // Gửi lại request ban đầu sau khi refresh thành công
                    } catch (refreshError) {
                        logout(); // Nếu refresh thất bại, đăng xuất
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
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
        <UserContext.Provider value={{ user, isLoggedIn, cartItemQuantity ,login, logout, handleGoogleCallback, getQuantityCartItem }}>
            {children}
        </UserContext.Provider>
    );
};
