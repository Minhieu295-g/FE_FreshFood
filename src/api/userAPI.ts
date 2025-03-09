import axios from "axios";
import {User} from "../types/User";
import {ProviderUrl, UserAccount, UserLogin} from "../types/login";

export const RegisterUser = async (user: User) => {
    try {
        const response = await axios.post(`http://localhost:80/user/`, user, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,

        });
        return response;
    } catch (error) {
        console.error("Đăng ký thất bại:", error);
        throw error;
    }
};
export const LoginAccount = async (login: UserAccount): Promise<UserLogin> => {
    const response = await axios.post(`http://localhost:80/auth/access`, login, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.data.status === 200) {
        return response.data.data;
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
}
export const LoginByGoogle = async (): Promise<ProviderUrl> => {
    const response = await axios.get(`http://localhost:80/auth/login-with-google`);
    if (response.data.status === 200) {
        return response.data;
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
}
export const LoginByFacebook = async (): Promise<ProviderUrl> => {
    const response = await axios.get(`http://localhost:80/auth/login-with-facebook`);
    if (response.data.status === 200) {
        return response.data;
    }
    throw new Error(response.data.message || "Lỗi không xác định từ API");
}
