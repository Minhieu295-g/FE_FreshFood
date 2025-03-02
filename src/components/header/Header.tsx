import React, {useState} from "react";

const Header = () =>{
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

    return (
        <nav className="bg-green-500 shadow-lg">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 flex items-center">
                            <img
                                className="block h-8 w-auto"
                                src="https://tailwindflex.com/images/logo.svg"
                                alt="Logo"
                            />
                            <span className="ml-2 text-xl font-bold text-white">Navbar</span>
                        </div>
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Home
                                </a>
                                <div className="relative group">
                                    <button
                                        className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                                        Products
                                        <svg
                                            className="ml-1 h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    <div
                                        className="absolute left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                        <div className="grid grid-cols-2 gap-8 p-6">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Software</h3>
                                                <ul className="space-y-3">
                                                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Web
                                                        Development</a></li>
                                                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Mobile
                                                        Apps</a></li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hardware</h3>
                                                <ul className="space-y-3">
                                                    <li><a href="#"
                                                           className="text-gray-600 hover:text-indigo-600">Laptops</a>
                                                    </li>
                                                    <li><a href="#"
                                                           className="text-gray-600 hover:text-indigo-600">Desktops</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href="#"
                                    className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Service
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    About
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Contract
                                </a>
                                <div style={{position: "relative"}}>
                                    <input
                                        className="rounded-3xl py-3 px-3 outline-none text-xs w-[350px] pr-10 hidden lg:block md:block border border-gray-300 bg-white"
                                        placeholder="Search for Grocery, Stores, Vegetable, or Meat"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5 text-green-900 absolute right-3 top-1/2 transform -translate-y-1/2 hidden lg:block md:block"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                        />
                                    </svg>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="hidden sm:flex sm:items-center">
                            <a href="#"
                               className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Login</a>
                            <a href="#"
                               className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sign
                                Up</a>
                        </div>
                    </div>
                    <div className="sm:hidden">
                        <button
                            type="button"
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <a href="#" className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium">Home</a>
                        <div className="relative">
                            <button className="w-full text-left px-3 py-2 text-gray-900 flex items-center justify-between" onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}>
                                Products
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {mobileDropdownOpen && (
                                <div className="px-4 py-2">
                                    <h4 className="text-gray-900 font-medium mb-2">Software</h4>
                                    <ul>
                                        <li><a href="#" className="text-gray-600 block">Web Development</a></li>
                                        <li><a href="#" className="text-gray-600 block">Mobile Apps</a></li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Header;