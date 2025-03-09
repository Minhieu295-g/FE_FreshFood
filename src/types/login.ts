export interface UserAccount {
    username: string,
    password: string,
}

export interface UserLogin {
    username: string,
    userId: string,
    cartId: string,
}
export interface ProviderUrl {
    status: number;
    message: string;
    data: string;
}