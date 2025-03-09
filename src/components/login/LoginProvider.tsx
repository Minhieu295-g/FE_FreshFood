import React, {useState} from "react";
import {LoginAccount, LoginByFacebook, LoginByGoogle} from "../../api/userAPI";
import {ProviderUrl} from "../../types/login";

const LoginProvider = () => {
    const[providerUrl, setProviderUrl] = useState<ProviderUrl>();
    const handleLoginGoogle = async (e: any) =>{
        try {

            const response = await LoginByGoogle();
            console.log(response)
            window.location.href = response.data;
        } catch (err: any) {
        }
    }
    const handleLoginFacebook = async (e: any) =>{
        try {

            const response = await LoginByFacebook();
            console.log(response)
            window.location.href = response.data;
        } catch (err: any) {
        }
    }
    return (
        <div className="mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white dark:bg-gray-700 px-2 text-gray-500 dark:text-white">
                                        Or continue with
                                    </span>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    onClick={handleLoginGoogle}
                    className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-500 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-wait disabled:opacity-50"
                    aria-label="Sign in with Google">
                    <img className="max-w-[25px]" src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                         alt="Google"/>
                </button>
                <button
                    onClick={handleLoginFacebook}
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-500 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:cursor-wait disabled:opacity-50"
                    aria-label="Sign in with GitHub">
                    <img className="max-w-[25px]" src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"
                         alt="Facebook"/>
                </button>
            </div>
            <div className="m-auto mt-6 w-fit md:mt-8">
                                <span className="m-auto dark:text-gray-400">
                                    Don't have an account?{' '}
                                    <a className="font-semibold text-indigo-600 dark:text-indigo-100" href="/register">
                                        Create Account
                                    </a>
                                </span>
            </div>
        </div>

    );

}
export default LoginProvider;