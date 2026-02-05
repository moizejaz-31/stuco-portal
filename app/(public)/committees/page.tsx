'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { Gavel, Heart, Scale, Calendar, Users, Briefcase, Globe, Monitor, Shield, DollarSign, BookOpen, Coffee, Truck, Leaf, Flag, Award, X, Info, User, CheckCircle2, Phone, Mail } from 'lucide-react'
import { getContactInfo, ContactInfo } from '@/app/utils/contactData'

// --- Types ---
interface Committee {
    id: string
    name: string
    short_description: string
    purpose: string
    structure: string[]
    roles: string[]
    chairs: string[]
    members: string[]
    icon_name?: string
}

// Icon map helper
const iconMap: Record<string, any> = {
    Gavel, Heart, Scale, Calendar, Users, Briefcase, Globe, Monitor, Shield, DollarSign, BookOpen, Coffee, Truck, Leaf, Flag, Award
}

// --- Animation Variants ---
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

const modalVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
}

export default function CommitteesPage() {
    const [committees, setCommittees] = useState<Committee[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null)
    const [selectedMember, setSelectedMember] = useState<{ name: string; contact?: ContactInfo } | null>(null)

    useEffect(() => {
        async function fetchCommittees() {
            setLoading(true)
            const { data } = await supabase
                .from('committees')
                .select('*')
                .order('priority', { ascending: false })
                .order('name')
            if (data) setCommittees(data)
            setLoading(false)
        }
        fetchCommittees()
    }, [])

    const handleMemberClick = (name: string) => {
        const contact = getContactInfo(name)
        if (contact) {
            setSelectedMember({ name, contact })
        }
    }

    return (
        <div className="space-y-16 pb-20 relative">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4 pt-10">
                <h1 className="font-serif text-5xl md:text-6xl text-maroon">Active Committees</h1>
                <div className="w-24 h-1 bg-maroon mx-auto" />
                <p className="text-stone-600 text-lg">
                    Our specialized committees work tirelessly to address specific areas of campus life and student needs.
                    Click on a committee to learn more about its mandate and structure.
                </p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-stone-500">Loading committees...</div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-0"
                >
                    {committees.map((committee) => {
                        // Default to 'Users' if icon not found
                        const Icon = iconMap[committee.icon_name || 'Users'] || Users;

                        return (
                            <motion.div variants={item} key={committee.id}>
                                <button
                                    onClick={() => setSelectedCommittee(committee)}
                                    className="group w-full block h-full bg-white border border-stone-200 p-8 rounded-2xl hover:shadow-xl hover:border-maroon/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer text-left"
                                >
                                    <div className="w-16 h-16 bg-cream-300 rounded-full flex items-center justify-center text-maroon mb-6 group-hover:bg-maroon group-hover:text-white transition-colors duration-300">
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 group-hover:text-maroon transition-colors">
                                        {committee.name}
                                    </h3>
                                    <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">
                                        {committee.short_description}
                                    </p>
                                    <div className="mt-4 text-xs font-semibold text-maroon uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details &rarr;
                                    </div>
                                </button>
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}

            {/* Committee Details Modal */}
            <AnimatePresence>
                {selectedCommittee && !selectedMember && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCommittee(null)}
                            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            variants={modalVariant}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-8 md:p-12 scrollbar-hide"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedCommittee(null)}
                                className="absolute top-6 right-6 p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-maroon hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Modal Header */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 bg-maroon/10 rounded-xl flex items-center justify-center text-maroon">
                                    {(() => {
                                        const Icon = iconMap[selectedCommittee.icon_name || 'Users'] || Users;
                                        return <Icon size={32} strokeWidth={1.5} />
                                    })()}
                                </div>
                                <div>
                                    <h2 className="font-serif text-3xl text-maroon font-bold">{selectedCommittee.name}</h2>
                                    <p className="text-stone-500 text-sm mt-1">{selectedCommittee.short_description}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Chairs & Members Section */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {selectedCommittee.chairs && selectedCommittee.chairs.length > 0 && (
                                        <section className="bg-cream-100 p-5 rounded-xl border border-cream-200">
                                            <h3 className="flex items-center gap-2 font-serif text-lg text-maroon mb-3 font-bold">
                                                <Award size={18} /> Committee Chairs
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedCommittee.chairs.map((chair, idx) => (
                                                    <li key={idx}>
                                                        <button
                                                            onClick={() => handleMemberClick(chair)}
                                                            className="flex items-center gap-2 text-stone-700 text-sm hover:text-maroon transition-colors w-full text-left group"
                                                        >
                                                            <CheckCircle2 size={14} className="text-maroon/60 group-hover:text-maroon" />
                                                            <span className="group-hover:underline decoration-maroon/30 underline-offset-2">{chair}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}

                                    {selectedCommittee.members && selectedCommittee.members.length > 0 && (
                                        <section className="bg-stone-50 p-5 rounded-xl border border-stone-100">
                                            <h3 className="flex items-center gap-2 font-serif text-lg text-stone-700 mb-3 font-bold">
                                                <Users size={18} /> Committee Members
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedCommittee.members.map((member, idx) => (
                                                    <li key={idx}>
                                                        <button
                                                            onClick={() => handleMemberClick(member)}
                                                            className="flex items-center gap-2 text-stone-600 text-sm hover:text-maroon transition-colors w-full text-left group"
                                                        >
                                                            <User size={14} className="text-stone-400 group-hover:text-maroon" />
                                                            <span className="group-hover:underline decoration-maroon/30 underline-offset-2">{member}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    )}
                                </div>

                                {/* Purpose */}
                                <section>
                                    <h3 className="flex items-center gap-2 font-serif text-xl text-stone-800 mb-3">
                                        <Info size={18} className="text-maroon" /> Statement of Purpose
                                    </h3>
                                    <p className="text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                                        {selectedCommittee.purpose}
                                    </p>
                                </section>

                                {/* Structure */}
                                <section>
                                    <h3 className="flex items-center gap-2 font-serif text-xl text-stone-800 mb-3">
                                        <Users size={18} className="text-maroon" /> Structure
                                    </h3>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {(selectedCommittee.structure || []).map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-stone-600 bg-white border border-stone-200 p-3 rounded-lg shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-maroon mt-2 shrink-0" />
                                                <span className="text-sm md:text-base">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* Roles and Regulations */}
                                <section>
                                    <h3 className="flex items-center gap-2 font-serif text-xl text-stone-800 mb-3">
                                        <BookOpen size={18} className="text-maroon" /> Roles & Regulations
                                    </h3>
                                    <ul className="space-y-3">
                                        {(selectedCommittee.roles || []).map((role, idx) => (
                                            <li key={idx} className="flex gap-3 text-stone-600 text-sm md:text-base">
                                                <span className="font-serif text-maroon font-bold opacity-40 select-none">
                                                    {(idx + 1).toString().padStart(2, '0')}.
                                                </span>
                                                {role}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            <div className="mt-8 pt-8 border-t border-stone-100 flex justify-end">
                                <button
                                    onClick={() => setSelectedCommittee(null)}
                                    className="px-6 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors font-medium"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Member Contact Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMember(null)}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px]"
                        />

                        {/* Contact Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 border border-stone-100"
                        >
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-4 right-4 p-1.5 bg-stone-50 rounded-full text-stone-400 hover:bg-maroon hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-cream-100 rounded-full mx-auto flex items-center justify-center text-maroon mb-3 border-2 border-white shadow-sm ring-1 ring-cream-200">
                                    <User size={30} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-stone-800">{selectedMember.name}</h3>
                                <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold mt-1">Contact Details</p>
                            </div>

                            <div className="space-y-3">
                                {selectedMember.contact?.phone && (
                                    <a href={`tel:${selectedMember.contact.phone.replace(/\s+/g, '')}`} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-cream-50 transition-colors group">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-400 group-hover:text-green-600 group-hover:shadow-sm transition-all border border-stone-100">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Phone Number</p>
                                            <p className="text-stone-700 font-medium group-hover:text-green-700 transition-colors">{selectedMember.contact.phone}</p>
                                        </div>
                                    </a>
                                )}

                                {selectedMember.contact?.email ? (
                                    <a href={`mailto:${selectedMember.contact.email}`} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl hover:bg-cream-50 transition-colors group">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-400 group-hover:text-blue-600 group-hover:shadow-sm transition-all border border-stone-100">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Email Address</p>
                                            <p className="text-stone-700 font-medium group-hover:text-blue-700 transition-colors">{selectedMember.contact.email}</p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-4 p-4 bg-stone-50/50 rounded-xl opacity-60">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-300 border border-stone-100">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400 font-medium uppercase tracking-wide">Email Address</p>
                                            <p className="text-stone-400 text-sm italic">Not available</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setSelectedMember(null)}
                                    className="text-sm text-stone-400 hover:text-maroon transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
