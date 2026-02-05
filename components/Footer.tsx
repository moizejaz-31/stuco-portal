import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
    return (
        <footer className="w-full mt-24 border-t border-stone-200 bg-[#FDFDFB]">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            <span className="font-serif text-lg font-bold text-maroon uppercase">
                                Student Council
                            </span>
                        </div>
                        <p className="text-stone-500 text-sm leading-relaxed">
                            The official representative body of students, dedicated to excellence, transparency, and progress.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/studentcouncil_lums/" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-maroon transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.linkedin.com/company/lums-sc/" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-maroon transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider text-stone-900 mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-sm text-stone-600">
                            <li><a href="/council-constitution.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-maroon transition">Council Constitution</a></li>
                            <li><a href="/Student Council Elections 2025 - Results - Sheet1.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-maroon transition">Elections 2025 Results</a></li>
                            <li><Link href="/projects" className="hover:text-maroon transition">Projects</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider text-stone-900 mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-stone-600">
                            <li><a href="/Student-Handbook.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-maroon transition">Student Handbook</a></li>
                            <li><a href="https://pern-my.sharepoint.com/:w:/g/personal/advising_lums_edu_pk/EUlFlk3DtphKmw9ffmEMWj8BPmQlQGG4fjMScAHUTxeYiQ?e=ffw1IP" target="_blank" rel="noopener noreferrer" className="hover:text-maroon transition">Petitions Policy</a></li>
                            <li><a href="https://pern-my.sharepoint.com/:x:/g/personal/advising_lums_edu_pk/EUevUCu-DClEhrRZ7Av6rNAB7yBoa3X2uZ2F8_hqnCESVA?e=yReqPg" target="_blank" rel="noopener noreferrer" className="hover:text-maroon transition">Petition Form</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider text-stone-900 mb-6">Council Office</h4>
                        <div className="space-y-4 text-sm text-stone-600">
                            <div className="flex items-start gap-3">
                                <MapPin size={16} className="mt-1 text-maroon shrink-0" />
                                <span>PDC 1st Floor, Student Lounge</span>
                            </div>
                            <a href="mailto:studentcouncil@lums.edu.pk" className="flex items-center gap-3 hover:text-maroon transition">
                                <Mail size={16} className="text-maroon shrink-0" />
                                studentcouncil@lums.edu.pk
                            </a>
                            <Link href="/contact" className="flex items-center gap-3 hover:text-maroon transition">
                                <Phone size={16} className="text-maroon shrink-0" />
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400 uppercase tracking-widest gap-4">
                    <p>© {new Date().getFullYear()} University Student Council. All Rights Reserved.</p>
                    <div className="flex gap-6 items-center">

                        {/* Admin Link */}
                        <Link href="/admin" className="hover:text-maroon font-bold text-maroon/50 transition-colors">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
