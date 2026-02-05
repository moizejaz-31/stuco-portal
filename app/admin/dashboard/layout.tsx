import { requireAuth, logout } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Users, FolderKanban, LogOut } from 'lucide-react'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await requireAuth()

    return (
        <div className="flex min-h-screen bg-stone-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-stone-200 fixed h-full z-10 hidden md:flex flex-col">
                <div className="p-8 border-b border-stone-100">
                    <span className="font-serif text-xl font-bold text-maroon">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-maroon rounded-xl transition font-medium">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/committees" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-maroon rounded-xl transition font-medium">
                        <Users size={20} /> Committees
                    </Link>
                    <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 hover:text-maroon rounded-xl transition font-medium">
                        <FolderKanban size={20} /> Projects
                    </Link>
                </nav>

                <div className="p-4 border-t border-stone-100">
                    <form action={logout}>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition font-medium">
                            <LogOut size={20} /> Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* content */}
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
