"use client"

import React, {useEffect, useState} from "react"

import { AdminSidebar } from "./AdminSidebar"
import { AdminHeader } from "./AdminHeader"
import { ThemeProvider } from "./ThemeProvider"
import {UserManagement} from "./user-management/UserManagement";

export default function AdminLayout(
//     {
//                                         children,
//                                     }: {
//     children: React.ReactNode
// }
) {
    // State to manage sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Check if we're on a large screen on initial load
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSidebarOpen(window.innerWidth >= 1024) // lg breakpoint
        }

        // Set initial state
        checkScreenSize()

        // Add event listener for resize
        window.addEventListener("resize", checkScreenSize)

        // Cleanup
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    // Function to open sidebar
    const openSidebar = () => setIsSidebarOpen(true)

    // Function to close sidebar
    const closeSidebar = () => setIsSidebarOpen(false)

    return (
        <ThemeProvider attribute="class" defaultTheme="light">
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                {/* Main content */}
                <div
                    className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
                >
                    <AdminHeader onOpenSidebar={openSidebar} />
                    <main className="flex-1 overflow-y-auto p-6">
                        {/*{children}*/}
                        <UserManagement/>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    )
}

