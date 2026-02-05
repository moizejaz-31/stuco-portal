'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Committees', href: '/committees' },
    { name: 'Projects', href: '/projects' },
    { name: 'Engagement', href: '/complaints' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#FDFDFB]/90 backdrop-blur-md shadow-sm border-b border-stone-200' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">

                    {/* Logo & Brand */}
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/logo.png"
                                alt="Council Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl font-bold tracking-tight text-maroon uppercase leading-none">
                                Student Council
                            </span>
                            <span className="text-[0.65rem] tracking-[0.2em] text-stone-500 font-medium uppercase mt-1 group-hover:text-maroon transition-colors">
                                Excellence in Governance
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-10 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-stone-600 hover:text-maroon transition-colors uppercase tracking-wide"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="px-6 py-2.5 rounded-full bg-maroon text-cream-50 font-bold text-sm tracking-wide hover:bg-[#3E000C] transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-300"
                        >
                            Contact Us
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-maroon hover:bg-maroon/5 rounded-md transition"
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#FDFDFB] border-t border-stone-200"
                    >
                        <div className="flex flex-col p-6 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-xl font-serif font-bold text-stone-800 hover:text-maroon"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center px-4 py-3 rounded-lg bg-maroon text-white font-bold hover:bg-[#3E000C]"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
