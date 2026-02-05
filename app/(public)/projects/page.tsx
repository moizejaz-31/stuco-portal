'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'

// --- Types ---
interface Project {
    id: string
    title: string
    description: string
    status: string
    category: string
    image_url?: string
    link?: string
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProjects() {
            setLoading(true)
            const { data } = await supabase
                .from('projects')
                .select('*')
                .order('priority', { ascending: false })
                .order('created_at', { ascending: false })

            if (data) setProjects(data)
            setLoading(false)
        }
        fetchProjects()
    }, [])

    return (
        <div className="space-y-16 pb-20 relative">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4 pt-10">
                <h1 className="font-serif text-5xl md:text-6xl text-maroon">Our Projects</h1>
                <div className="w-24 h-1 bg-maroon mx-auto" />
                <p className="text-stone-600 text-lg">
                    Initiatives designed to improve student life, infrastructure, and academic excellence.
                </p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-stone-500">Loading projects...</div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {projects.map((project) => (
                        <motion.div key={project.id} variants={item} className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                            {/* Wrapper Link based on whether a link exists */}
                            {project.link ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="block relative h-48 bg-cream-200 group overflow-hidden">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300 font-serif text-4xl font-bold opacity-30">
                                            {project.title.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-maroon rounded-full shadow-sm">
                                        {project.status}
                                    </div>
                                </a>
                            ) : (
                                <div className="h-48 bg-cream-200 relative overflow-hidden group">
                                    {project.image_url ? (
                                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-300 font-serif text-4xl font-bold opacity-30">
                                            {project.title.charAt(0)}
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-maroon rounded-full shadow-sm">
                                        {project.status}
                                    </div>
                                </div>
                            )}

                            <div className="p-8 flex flex-col flex-1">
                                <span className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-3">{project.category}</span>
                                {project.link ? (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-maroon transition-colors"><h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">{project.title}</h3></a>
                                ) : (
                                    <h3 className="font-serif text-2xl font-bold text-stone-900 mb-4">{project.title}</h3>
                                )}
                                <p className="text-stone-600 leading-relaxed mb-6 flex-1">
                                    {project.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {projects.length === 0 && !loading && (
                <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-200 border-dashed">
                    <p className="text-stone-500 text-lg">No active projects at the moment.</p>
                </div>
            )}
        </div>
    )
}
