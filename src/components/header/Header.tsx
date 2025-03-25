"use client"

import React, { useContext, useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../../contexts/UserContext"
import { Search, ShoppingCart, User, Menu, X, ChevronDown, LogOut, Settings, UserCircle, Home, Phone, Info, Briefcase } from 'lucide-react'

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)

    const { isLoggedIn, logout, user, cartItemQuantity } = useContext(UserContext)!

    const profileRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Handle search focus
    const handleSearchFocus = () => {
        setSearchFocused(true)
        searchRef.current?.focus()
    }

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'bg-white shadow-md'
                    : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16 md:h-20">
                    {/* Logo and brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center">
                            <img
                                className="h-8 w-auto"
                                src="https://tailwindflex.com/images/logo.svg"
                                alt="Logo"
                            />
                            <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-green-600' : 'text-white'} transition-colors duration-300`}>
                FreshMart
              </span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex md:space-x-1 lg:space-x-2">
                        <NavLink href="/" isScrolled={isScrolled}>
                            <Home className="w-4 h-4 mr-1" />
                            <span>Home</span>
                        </NavLink>

                        {/* Products dropdown */}
                        <div className="relative group">
                            <NavLink href="/product-filter" isScrolled={isScrolled} hasDropdown>
                                <Briefcase className="w-4 h-4 mr-1" />
                                <span>Products</span>
                                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180`} />
                            </NavLink>

                            <div className="absolute left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top scale-95 group-hover:scale-100">
                                <div className="grid grid-cols-2 gap-8 p-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="text-green-600 text-xs">1</span>
                      </span>
                                            Fresh Produce
                                        </h3>
                                        <ul className="space-y-3">
                                            <li>
                                                <Link to="/product-filter?category=fruits" className="text-gray-600 hover:text-green-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                    Fruits
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/product-filter?category=vegetables" className="text-gray-600 hover:text-green-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                    Vegetables
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/product-filter?category=herbs" className="text-gray-600 hover:text-green-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                    Herbs & Spices
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="text-green-600 text-xs">2</span>
                      </span>
                                            Pantry Items
                                        </h3>
                                        <ul className="space-y-3">
                                            <li>
                                                <Link to="/product-filter?category=grains" className="text-gray-600 hover:text-green-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                    Grains & Rice
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/product-filter?category=canned" className="text-gray-600 hover:text-green-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                    Canned Goods
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/product-filter?category=snacks" className="text-gray-600 hover:text-green-600 flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                    Snacks
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 rounded-b-lg">
                                    <Link to="/product-filter" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                                        View all categories
                                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <NavLink href="/services" isScrolled={isScrolled}>
                            <Briefcase className="w-4 h-4 mr-1" />
                            <span>Services</span>
                        </NavLink>

                        <NavLink href="/about" isScrolled={isScrolled}>
                            <Info className="w-4 h-4 mr-1" />
                            <span>About</span>
                        </NavLink>

                        <NavLink href="/contact" isScrolled={isScrolled}>
                            <Phone className="w-4 h-4 mr-1" />
                            <span>Contact</span>
                        </NavLink>
                    </nav>

                    {/* Search bar */}
                    <div className={`hidden lg:block relative ${searchFocused ? 'flex-grow mx-4' : ''} transition-all duration-300`}>
                        <div className="relative">
                            <input
                                ref={searchRef}
                                className={`rounded-full py-2 px-4 pr-10 outline-none text-sm w-full border ${
                                    isScrolled ? 'border-gray-300 focus:border-green-500' : 'border-green-400 focus:border-white bg-green-400/30 text-white placeholder-white/80'
                                } transition-all duration-300 ${
                                    searchFocused ? 'w-full' : 'w-64'
                                }`}
                                placeholder="Search for products..."
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            <button
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                    isScrolled ? 'text-gray-500' : 'text-white'
                                }`}
                                onClick={handleSearchFocus}
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Cart icon */}
                        <Link
                            to="/cart"
                            className={`relative p-2 rounded-full ${
                                isScrolled
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-white hover:bg-green-600'
                            } transition-colors duration-200`}
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {/* Badge */}
                            {(isLoggedIn && cartItemQuantity > 0) && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemQuantity > 99 ? '99+' : cartItemQuantity}
                </span>
                            )}
                        </Link>

                        {/* User account */}
                        {!isLoggedIn ? (
                            <div className="hidden sm:flex sm:items-center sm:space-x-2">
                                <Link
                                    to="/login"
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                        isScrolled
                                            ? 'text-green-600 hover:bg-green-50'
                                            : 'text-white hover:bg-green-600'
                                    } transition-colors duration-200`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                                        isScrolled
                                            ? 'bg-green-600 text-white hover:bg-green-700'
                                            : 'bg-white text-green-600 hover:bg-green-50'
                                    } transition-colors duration-200`}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        ) : (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className={`flex items-center space-x-2 p-1.5 rounded-full ${
                                        isScrolled
                                            ? 'hover:bg-gray-100 text-gray-700'
                                            : 'hover:bg-green-600 text-white'
                                    } transition-colors duration-200 focus:outline-none`}
                                    aria-label="User menu"
                                >
                                    <img
                                        className="h-8 w-8 rounded-full object-cover border-2 border-white shadow-sm"
                                        src={"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                                        alt={user?.fullName || "User"}
                                    />
                                    <span className={`hidden sm:block text-sm font-medium ${profileDropdownOpen ? 'max-w-[100px] truncate' : ''}`}>
                    {/^\d+$/.test(user?.username || "") ? user?.fullName : user?.username}
                  </span>
                                    <ChevronDown className={`hidden sm:block h-4 w-4 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile dropdown */}
                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden transform origin-top-right transition-all duration-200">
                                        <div className="p-3 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                                    src={"https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
                                                    alt={user?.fullName || "User"}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user?.username}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                <UserCircle className="mr-3 h-4 w-4 text-gray-500" />
                                                Your Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                <Settings className="mr-3 h-4 w-4 text-gray-500" />
                                                Settings
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            >
                                                <ShoppingCart className="mr-3 h-4 w-4 text-gray-500" />
                                                Your Orders
                                            </Link>
                                        </div>

                                        <div className="py-1 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    logout()
                                                    setProfileDropdownOpen(false)
                                                }}
                                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut className="mr-3 h-4 w-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className={`md:hidden p-2 rounded-md ${
                                isScrolled
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-white hover:bg-green-600'
                            } transition-colors duration-200`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg border-t border-gray-200 overflow-hidden transition-all duration-300 max-h-screen">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {/* Mobile search */}
                        <div className="relative my-3">
                            <input
                                className="w-full rounded-full py-2 px-4 pr-10 border border-gray-300 focus:border-green-500 focus:outline-none text-sm"
                                placeholder="Search for products..."
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>

                        <MobileNavLink href="/" icon={<Home className="w-5 h-5" />}>
                            Home
                        </MobileNavLink>

                        <div>
                            <button
                                className="w-full flex items-center justify-between px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                            >
                                <div className="flex items-center">
                                    <Briefcase className="w-5 h-5 mr-3 text-green-600" />
                                    <span>Products</span>
                                </div>
                                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {mobileDropdownOpen && (
                                <div className="mt-1 ml-10 space-y-2 border-l-2 border-gray-100 pl-3">
                                    <Link to="/product-filter?category=fruits" className="block py-1 text-gray-600 hover:text-green-600">
                                        Fruits
                                    </Link>
                                    <Link to="/product-filter?category=vegetables" className="block py-1 text-gray-600 hover:text-green-600">
                                        Vegetables
                                    </Link>
                                    <Link to="/product-filter?category=grains" className="block py-1 text-gray-600 hover:text-green-600">
                                        Grains & Rice
                                    </Link>
                                    <Link to="/product-filter" className="block py-1 text-green-600 font-medium hover:text-green-700">
                                        View all categories
                                    </Link>
                                </div>
                            )}
                        </div>

                        <MobileNavLink href="/services" icon={<Briefcase className="w-5 h-5" />}>
                            Services
                        </MobileNavLink>

                        <MobileNavLink href="/about" icon={<Info className="w-5 h-5" />}>
                            About
                        </MobileNavLink>

                        <MobileNavLink href="/contact" icon={<Phone className="w-5 h-5" />}>
                            Contact
                        </MobileNavLink>

                        {/* Mobile auth buttons */}
                        {!isLoggedIn && (
                            <div className="pt-2 border-t border-gray-200 mt-3 grid grid-cols-2 gap-2">
                                <Link
                                    to="/login"
                                    className="flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium border border-green-600 text-green-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

// Desktop navigation link component
const NavLink = ({
                     href,
                     children,
                     isScrolled,
                     hasDropdown = false
                 }: {
    href: string,
    children: React.ReactNode,
    isScrolled: boolean,
    hasDropdown?: boolean
}) => {
    return (
        <Link
            to={href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-green-600'
            } transition-colors duration-200 ${hasDropdown ? 'group' : ''}`}
        >
            {children}
        </Link>
    )
}

// Mobile navigation link component
const MobileNavLink = ({
                           href,
                           children,
                           icon
                       }: {
    href: string,
    children: React.ReactNode,
    icon: React.ReactNode
}) => {
    return (
        <Link
            to={href}
            className="flex items-center px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
        >
            <span className="mr-3 text-green-600">{icon}</span>
            {children}
        </Link>
    )
}

export default Header
