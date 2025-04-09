import axios from "axios";
import {User, UserRequestDTO, UserResponseDTO} from "../types/User";
import {ProviderUrl, UserAccount, UserLogin} from "../types/login";
import api from "./api";

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

// Hàm lấy danh sách người dùng
export const getUsers = async (): Promise<UserResponseDTO[]> => {
    try {
        const response = await api.get(`/user/list`);
        if (response.data.status === 200) {
            return response.data.data.items;
        }
        return [
            {
                id: 1,
                username: "admin",
                fullName: "Quản Trị Viên",
                numberPhone: "0987654321",
                email: "admin@example.com",
                provider: "LOCAL",
                role: "ADMIN",
            },
            {
                id: 2,
                username: "nhanvien1",
                fullName: "Nhân Viên 1",
                numberPhone: "0987654322",
                email: "staff1@example.com",
                provider: "LOCAL",
                role: "STAFF",
            },
            {
                id: 3,
                username: "khachhang1",
                fullName: "Khách Hàng 1",
                numberPhone: "0987654323",
                email: "customer1@example.com",
                provider: "LOCAL",
                role: "CUSTOMER",
            },
            {
                id: 4,
                username: "fbuser",
                fullName: "Người Dùng Facebook",
                numberPhone: "0987654324",
                email: "fb.user@example.com",
                provider: "FACEBOOK",
                providerId: "12345678",
                role: "CUSTOMER",
            },
            {
                id: 5,
                username: "googleuser",
                fullName: "Người Dùng Google",
                numberPhone: "0987654325",
                email: "google.user@example.com",
                provider: "GOOGLE",
                providerId: "87654321",
                role: "CUSTOMER",
            },
        ]
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error)
        throw error
    }
}

// Hàm thêm người dùng mới
export const addUser = async (user: UserRequestDTO): Promise<UserResponseDTO> => {
    try {
        console.log("User",user);
        const response = await api.post(`/admin/user/`, user, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return {
            id: Math.floor(Math.random() * 1000) + 10,
            ...user,
        }
    } catch (error) {
        console.error("Lỗi khi thêm người dùng:", error)
        throw error
    }
}

// Hàm cập nhật người dùng
export const updateUser = async (id: number, user: UserRequestDTO): Promise<UserResponseDTO> => {
    try {
        console.log("User",user);
        const response = await api.put(`/admin/user/${id}`, user, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return {
            id,
            ...user,
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error)
        throw error
    }
}

// Hàm xóa người dùng
export const deleteUser = async (id: number): Promise<void> => {
    try {
        await api.delete(`/user/${id}`)
        console.log(`Đã xóa người dùng có ID: ${id}`)
        return
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error)
        throw error
    }
}


