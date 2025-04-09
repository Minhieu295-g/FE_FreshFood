export interface User {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
}

export interface UserRequestDTO {
    username: string
    fullName: string
    numberPhone: string
    email: string
    password?: string
    provider: "LOCAL" | "FACEBOOK" | "GOOGLE"
    providerId?: string
    role: "CUSTOMER" | "ADMIN" | "STAFF"
}


export interface UserResponseDTO {
    id: number
    username: string
    fullName: string
    numberPhone: string
    email: string
    provider: "LOCAL" | "FACEBOOK" | "GOOGLE"
    providerId?: string
    role: "CUSTOMER" | "ADMIN" | "STAFF"
}

export interface ToastState {
    show: boolean
    message: string
    type: "success" | "error" | "info" | "warning"
}
