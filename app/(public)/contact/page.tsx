'use client'

import { Mail, MessageCircle, Search, SlidersHorizontal, MapPin, User, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import { useState } from 'react'
import { getContactInfo } from '@/app/utils/contactData'

// --- Data ---
const executiveMembers = [
    { name: "Junaid Asghar Tarar", role: "President", office: "Student Council Office", email: "26020285@lums.edu.pk" },
    { name: "Nishat Zafar", role: "Vice President", office: "Student Council Office", email: "24140005@lums.edu.pk" },
    { name: "Altamash Jawaid", role: "General Secretary", office: "Student Council Office", email: "28090055@lums.edu.pk" },
]

const committeeMembers = [
    {
        name: "Muhammad Suleman Butt",
        role: "Chair of Disciplinary Committee (Non-Academic DC)",
        committee: "Disciplinary Committee (Non-Academic DC)",
        email: "26090020@lums.edu.pk"
    },
    {
        name: "Mahnoor Mirza",
        role: "Chair of Disciplinary Committee (HSS) & Food & Pricing",
        committee: "Multiple Committees",
        email: "27020525@lums.edu.pk"
    },
    {
        name: "Sauban Numan",
        role: "Chair of Disciplinary Committee (HSS), Community Welfare, & Food & Pricing",
        committee: "Multiple Committees",
        email: "27020270@lums.edu.pk"
    },
    {
        name: "Muhammad Bilal Zafar",
        role: "Chair of Disciplinary Committee (SDSB), Campus Development, & Special Events",
        committee: "Multiple Committees",
        email: "26110040@lums.edu.pk"
    },
    {
        name: "Ashoraim Orakzai",
        role: "Chair of Disciplinary Committee (SDSB) & Sports",
        committee: "Multiple Committees",
        email: "28020321@lums.edu.pk"
    },
    {
        name: "Mirza Saad Iftikhar",
        role: "Chair of Disciplinary Committee (SAHSOL) & Residence",
        committee: "Multiple Committees",
        email: "27090058@lums.edu.pk"
    },
    {
        name: "Abdul Hadi",
        role: "Chair of Disciplinary Committee (SSE) & Community Welfare",
        committee: "Multiple Committees",
        email: "27100307@lums.edu.pk"
    },
    {
        name: "Ahsan Kaleem",
        role: "Chair of Disciplinary Committee (SSE) & Graduate Affairs",
        committee: "Multiple Committees",
        email: "22140022@lums.edu.pk"
    },
    {
        name: "Mahrukh",
        role: "Chair of Disciplinary Committee (SOE)",
        committee: "Disciplinary Committee (SOE)",
        email: "24170026@lums.edu.pk"
    },
    {
        name: "Hajira Batool",
        role: "Chair of Health & Wellness",
        committee: "Health & Wellness",
        email: "29090045@lums.edu.pk"
    },
    {
        name: "Eshal Faisal",
        role: "Chair of Health & Wellness & Campus Development",
        committee: "Multiple Committees",
        email: "27100253@lums.edu.pk"
    },
    {
        name: "Moiz Ejaz",
        role: "Chair of Welfare and Academic Affairs",
        committee: "Community Welfare & Academic Affairs",
        email: "28100357@lums.edu.pk"
    },
    {
        name: "Shireena Baig",
        role: "Chair of Community Welfare, Campus Development, & Residence",
        committee: "Multiple Committees",
        email: "26020049@lums.edu.pk"
    },
    {
        name: "Zainab Rana",
        role: "Chair of Community Welfare, Harassment Support, & Special Events",
        committee: "Multiple Committees",
        email: "26020178@lums.edu.pk"
    },
    {
        name: "Wania Iftikhar",
        role: "Chair of Internal Affairs",
        committee: "Internal Affairs",
        email: "28110394@lums.edu.pk"
    },
    {
        name: "Ahmed Sultan",
        role: "Chair of Academic Affairs",
        committee: "Academic Affairs",
        email: "29090003@lums.edu.pk"
    },
    {
        name: "Amna Asim",
        role: "Chair of Diversity & Inclusion",
        committee: "Diversity & Inclusion",
        email: "28100440@lums.edu.pk"
    },
    {
        name: "Muhammad Salman Ahmad",
        role: "Chair of Career Services",
        committee: "Career Services",
        email: "24280002@lums.edu.pk"
    },
    {
        name: "Maaidah Kaleem Butt",
        role: "Chair of Career Services",
        committee: "Career Services",
        email: "26100126@lums.edu.pk"
    },
    {
        name: "Asim Bangash",
        role: "Chair of Career Services & Graduate Affairs",
        committee: "Multiple Committees",
        email: "26010024@lums.edu.pk"
    },
    {
        name: "Nashmiya",
        role: "Chair of Internal Affairs & Special Events",
        committee: "Multiple Committees",
        email: "27110098@lums.edu.pk"
    },
    {
        name: "Muhammad Owais Chandio",
        role: "Chair of Diversity & Inclusion & Food & Pricing",
        committee: "Multiple Committees",
        email: "27110301@lums.edu.pk"
    },
    {
        name: "Abdullah Khan",
        role: "Chair of Graduate Affairs",
        committee: "Graduate Affairs",
        email: "24250004@lums.edu.pk"
    },
    {
        "name": "Jaweria Shabbir",
        "role": "Chair of Harassment Support & Sports",
        "committee": "Multiple Committees",
        "email": "26090057@lums.edu.pk"
    },
    {
        "name": "Syed Tabish Khaqan",
        "role": "Chair of Academic Affairs",
        "committee": "Academic Affairs",
        "email": "26100357@lums.edu.pk"
    }
]

const committeesList = [
    "Academic Affairs", "Campus Development", "Career Services", "Community Welfare",
    "Disciplinary Committee", "Diversity & Inclusion", "Food & Pricing", "Graduate Affairs",
    "Harassment Support", "Health & Wellness", "Internal Affairs", "Residence",
    "Special Events", "Sports"
]

export default function ContactPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCommittee, setSelectedCommittee] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 9

    // --- Filter Logic ---
    const allMembers = [...executiveMembers, ...committeeMembers]
    const filteredMembers = allMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member as any).committee?.toLowerCase().includes(searchTerm.toLowerCase())

        const memberCommittee = (member as any).committee || "";
        const matchesCommittee = selectedCommittee === '' ||
            memberCommittee === selectedCommittee ||
            member.role.toLowerCase().includes(selectedCommittee.toLowerCase()) ||
            memberCommittee.toLowerCase().includes(selectedCommittee.toLowerCase())

        return matchesSearch && matchesCommittee
    })

    // --- Pagination Logic ---
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
    const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    return (
        <div className="space-y-12 pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-8">
                <div className="space-y-4 max-w-2xl">
                    <h1 className="font-serif text-5xl md:text-6xl text-maroon">Council Directory</h1>
                    <p className="text-stone-600 text-lg">
                        Connect with your student representatives. Find Executive Officers, Committee Chairs, and members.
                    </p>
                </div>
                <a href="mailto:studentcouncil@lums.edu.pk" className="px-6 py-3 bg-maroon text-white font-bold rounded-lg hover:bg-[#3E000C] transition shadow-md">
                    Contact Council
                </a>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, committee, or role..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition shadow-sm"
                    />
                </div>
                <div className="relative">
                    <select
                        value={selectedCommittee}
                        onChange={(e) => { setSelectedCommittee(e.target.value); setCurrentPage(1); }}
                        className="appearance-none h-full bg-white border border-stone-200 text-stone-700 py-4 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon shadow-sm cursor-pointer"
                    >
                        <option value="">All Committees</option>
                        {committeesList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={20} />
                </div>
            </div>


            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedMembers.map((member, idx) => {
                    const contactInfo = getContactInfo(member.name);
                    const phone = contactInfo?.phone;

                    return (
                        <div key={idx} className="bg-white border border-stone-200 p-6 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">

                            <div className="flex items-start justify-between">
                                <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center text-maroon font-serif font-bold text-xl">
                                    {member.name.charAt(0)}
                                </div>
                                <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold uppercase rounded-full">
                                    {(member as any).committee ? 'Committee' : 'Executive'}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-serif text-xl font-bold text-stone-900 mb-1">{member.name}</h3>
                                <p className="text-sm font-bold text-maroon mb-1">{member.role}</p>
                                {(member as any).committee && (
                                    <p className="text-sm text-stone-500">{(member as any).committee}</p>
                                )}
                                {!(member as any).committee && (
                                    <p className="text-sm text-stone-500">{(member as any).office}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-stone-100">
                                <a href={`mailto:${(member as any).email || 'studentcouncil@lums.edu.pk'}`} className="w-full bg-stone-50 text-stone-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-maroon hover:text-white transition shadow-sm flex items-center justify-center gap-2">
                                    <Mail size={16} /> Contact via Email
                                </a>
                                {phone && (
                                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="w-full bg-white border-2 border-green-600/10 text-stone-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-600 hover:text-white hover:border-green-600 transition shadow-sm flex items-center justify-center gap-2">
                                        <Phone size={16} /> {phone}
                                    </a>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination Controls */}
            {
                totalPages > 1 && (
                    <div className="flex justify-between items-center pt-8 border-t border-stone-200">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="text-stone-500 font-medium hover:text-maroon transition disabled:opacity-50 flex items-center gap-1"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 rounded font-bold text-sm transition ${currentPage === page
                                        ? 'bg-[#3E000C] text-white'
                                        : 'hover:bg-stone-100 text-stone-600'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="text-stone-500 font-medium hover:text-maroon transition disabled:opacity-50 flex items-center gap-1"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )
            }

        </div >
    )
}
