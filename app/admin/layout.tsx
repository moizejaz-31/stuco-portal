import { requireAuth } from '@/lib/auth'
import Link from 'next/link'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Protect all routes under /admin/dashboard
    // Since we are applying this to the root of /admin, it might conflict with the login page.
    // Wait, layout.tsx applies to current directory and children. 
    // If I put this in app/admin/layout.tsx, it wraps app/admin/page.tsx too.
    // So I should only check auth in dashboard/layout.tsx or individually. 
    // Let's create a layout ONLY for dashboard.

    return (
        <div className="min-h-screen bg-stone-50">
            {children}
        </div>
    )
}
