import React, { useState } from "react";
import {User} from "../../types/User";
import {RegisterUser} from "../../api/userAPI";

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    api?: string;
}

const Register = () => {
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        email: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const submitApi = async (user: User) =>{
        try {
            const response = await RegisterUser(user)
            if (response.status === 201 || response.status === 200) {
                setSuccessMessage(' Đăng kí tài khoản thành công ');
            } else {
                const errorData = await response.data;
                setErrors({ api: errorData.message || 'Đăng kí tài khoản thất bại' });
            }
        }catch (e){
            setErrors({ api: 'Error connecting to server' });
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        const { username, password, confirmPassword, email, phone } = formData;

        let newErrors: FormErrors = {};

        if (!username) {
            newErrors.username = 'Vui lòng nhập username';
        } else if (username.length < 8) {
            newErrors.username = 'Username phải ít nhất 8 kí tự';
        }

        const EMAIL_PATTERN = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
        if (!email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!EMAIL_PATTERN.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập password';
        } else if (password.length < 8) {
            newErrors.password = 'Password phải có ít nhất 8 ký tự';
        } else {
            let hasUppercase = /[A-Z]/.test(password);
            let hasDigit = /\d/.test(password);
            let hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password);

            if (!hasUppercase) {
                newErrors.password = 'Password phải có ít nhất một ký tự viết hoa';
            }
            if (!hasDigit) {
                newErrors.password = 'Password phải có ít nhất một chữ số';
            }
            if (!hasSpecialCharacter) {
                newErrors.password = 'Password phải có ít nhất một ký tự đặc biệt';
            }
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords không trùng khớp';
        }

        const vietnamesePhoneNumberPattern = /^(03|05|07|08|09)\d{8}$/;
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại";
        } else if (!vietnamesePhoneNumberPattern.test(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const { confirmPassword, ...userData } = formData;
            submitApi(userData);
        } else {
            setSuccessMessage("");
        }
    };

    return (
        <div className="bg-gray-white flex items-center justify-center px-4 sm:px-6 lg:px-8 mt-10 mb-10">
            <div className="w-full max-w-md space-y-8">
                <div className="bg-white shadow-md rounded-md p-6">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="https://www.svgrepo.com/show/499664/user-happy.svg"
                        alt="User Icon"
                    />
                    <h2 className="my-3 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign up for an account
                    </h2>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {successMessage && (
                            <p className="text-green-500 text-center">{successMessage}</p>
                        )}
                        {errors.api && <p className="text-red-500 text-sm">{errors.api}</p>}


                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                            <input
                                name="username"
                                type="text"
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                value={formData.username}
                                onChange={handleChange}
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                            <input
                                name="password"
                                type="password"
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                            <input
                                name="confirmPassword"
                                type="password"
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                            <input
                                name="fullName"
                                type="text"
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                            <input
                                name="phone"
                                type="tel"
                                className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>

                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                        >
                            Register Account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
