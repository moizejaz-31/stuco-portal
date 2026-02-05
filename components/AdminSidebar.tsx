'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, FolderKanban, Home, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
    const pathname = usePathname()

    const links = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/committees', label: 'Committees', icon: Users },
        { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
    ]

    return (
        <div className="w-64 bg-white border-r border-stone-200 min-h-screen p-6 flex flex-col fixed left-0 top-0 bottom-0 z-40">
            <div className="mb-10 px-2">
                <h2 className="font-serif text-2xl font-bold text-maroon">Admin Panel</h2>
            </div>

            <nav className="space-y-2 flex-1">
                {links.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-maroon text-white shadow-md'
                                    : 'text-stone-600 hover:bg-stone-50 hover:text-maroon'
                                }`}
                        >
                            <link.icon size={20} />
                            {link.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-stone-100 pt-6 mt-6 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-colors"
                >
                    <Home size={20} />
                    View Website
                </Link>
            </div>
        </div>
    )
}
