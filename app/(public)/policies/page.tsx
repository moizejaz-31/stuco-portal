'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FileText, Shield, Gavel } from 'lucide-react'

const policies = [
    {
        title: "Student Constitution",
        icon: Shield,
        content: "The supreme governing document of the student body. It outlines the rights, responsibilities, and structure of the council. Article I defines the purpose...",
        updated: "Aug 2024"
    },
    {
        title: "Code of Conduct",
        icon: Gavel,
        content: "Expected behavior for all students within campus premises. Zero tolerance policy for harassment, vandalism, and academic dishonesty.",
        updated: "Jan 2024"
    },
    {
        title: "Election Guidelines",
        icon: FileText,
        content: "Rules and regulations governing student council elections. Includes eligibility criteria, campaigning rules, and voting procedures.",
        updated: "Feb 2025"
    },
    {
        title: "Club & Society Manual",
        icon: FileText,
        content: "Procedures for registering new societies, requesting funding, and organizing events. All societies must adhere to these guidelines.",
        updated: "Sep 2023"
    },
    {
        title: "Hostel Regulations",
        icon: FileText,
        content: "Rules regarding curfew, guests, and maintenance of hostel property. Detailed fines structure for violations.",
        updated: "Aug 2024"
    }
]

export default function PoliciesPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="max-w-3xl mx-auto space-y-12 pb-20">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Policies & Mandate</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Know your rights. Understand the rules. Review the documents that govern our community.
                </p>
            </div>

            <div className="space-y-4">
                {policies.map((policy, idx) => (
                    <div key={idx} className="glass rounded-xl border border-white/10 overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/10 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <policy.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{policy.title}</h3>
                                    <span className="text-xs text-slate-500">Last updated: {policy.updated}</span>
                                </div>
                            </div>
                            <ChevronDown
                                className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <AnimatePresence>
                            {openIndex === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/50">
                                        {policy.content}
                                        <div className="mt-4">
                                            <button className="text-sm font-semibold text-blue-600 hover:underline">Download full PDF &rarr;</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    )
}
