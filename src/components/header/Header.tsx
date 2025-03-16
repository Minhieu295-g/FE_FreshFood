import React, {useContext, useState} from "react";
import {Link} from "react-router-dom";
import {UserContext} from "../../contexts/UserContext";

const Header = () =>{
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const { isLoggedIn, logout, user, cartItemQuantity } = useContext(UserContext)!;
    console.log(cartItemQuantity + " la so luong cua no")
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
                                    href="/"
                                    className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Home
                                </a>
                                <div className="relative group">
                                    <Link to={`/product-filter`}>
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
                                    </Link>

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
                        className={"relative right-5"}>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor"
                             className="w-8 h-8 text-white rounded-full ring-2 ring-white p-1 relative">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
                        </svg>

                        {/* Badge số lượng sản phẩm */}
                        <span
                            className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
        {!isLoggedIn ? (0) : cartItemQuantity}
    </span>

                    </div>

                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                        {!isLoggedIn ? (
                            <div className="hidden sm:flex sm:items-center">
                                <Link to="/login"
                                      className="text-white hover:bg-green-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                                <Link to="/signup"
                                      className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sign
                                    Up</Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className="flex items-center text-white focus:outline-none">
                                    <img className="h-8 w-8 rounded-full"
                                         src={"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                                         alt="User Avatar"/>

                                    <span className="ml-2 hidden sm:block">
                                        {/^\d+$/.test(user?.username || "") ? user?.fullName : user?.username}
                                    </span>
                     </button>
                                {profileDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        <div className="p-2">
                                            <p className="text-gray-800 font-semibold">{user?.fullName}</p>
                                        </div>
                                        <hr/>
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Your
                                            Profile</Link>
                                        <Link to="/settings"
                                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
                                        <button onClick={logout}
                                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Sign
                                            out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="sm:hidden">
                        <button
                            type="button"
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 6h16M4 12h16M4 18h16"/>
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