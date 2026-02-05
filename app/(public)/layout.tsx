
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
                {children}
            </main>
            <Footer />
        </>
    )
}
