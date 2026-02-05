'use client'

import AdminSidebar from '@/components/AdminSidebar'

export default function AdminDashboard() {
    return (
        <div className="flex bg-stone-50 min-h-screen">
            <div className="hidden md:block">
                <AdminSidebar />
            </div>

            <main className="flex-1 md:ml-64 p-8">
                <div className="space-y-8 max-w-5xl mx-auto">
                    <h1 className="font-serif text-3xl font-bold text-stone-800">Hello, Admin</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-stone-700 mb-2">Manage Committees</h3>
                            <p className="text-stone-500 mb-6">Update committee details, chairs, and members.</p>
                            <a href="/admin/committees" className="text-maroon font-bold hover:underline inline-flex items-center">Go to Committees &rarr;</a>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-bold text-stone-700 mb-2">Manage Projects</h3>
                            <p className="text-stone-500 mb-6">Add new projects, update statuses, or remove old ones.</p>
                            <a href="/admin/projects" className="text-maroon font-bold hover:underline inline-flex items-center">Go to Projects &rarr;</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
