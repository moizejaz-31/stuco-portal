'use client'

import { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Gavel, Users, Scale, Heart, Calendar, ArrowUpRight } from 'lucide-react'
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

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const stagger: Variants = {
  show: {
    transition: { staggerChildren: 0.1 }
  }
}

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)

  useEffect(() => {
    async function fetchFeaturedProjects() {
      setLoadingProjects(true)
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3)

      if (data) setFeaturedProjects(data)
      setLoadingProjects(false)
    }
    fetchFeaturedProjects()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-600 text-white'
      case 'Upcoming': return 'bg-maroon-800 text-white'
      default: return 'bg-maroon text-white' // Ongoing
    }
  }

  const getFallbackBg = (index: number) => {
    const colors = ['bg-stone-800', 'bg-stone-300', 'bg-stone-600']
    return colors[index % colors.length]
  }

  return (
    <div className="space-y-32 pb-20">

      {/* Hero Section */}
      <section className="relative h-[85vh] rounded-[2rem] overflow-hidden flex items-center justify-center text-center px-4">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-[url('/finalljpg.jpg.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A0404]/95 via-[#4A0404]/70 to-transparent" />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeIn}
          className="relative z-10 max-w-4xl mx-auto space-y-8"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight leading-tight">
            Serving the Voice of <span className="italic">Every Student.</span>
          </h1>
          <p className="text-xl text-cream-200 font-light max-w-2xl mx-auto leading-relaxed">
            Dedicated to fostering a vibrant campus life, advocating for student rights, and building a community where excellence thrives.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/complaints"
              className="px-8 py-4 rounded-full bg-maroon-600 text-white font-bold tracking-wide hover:bg-maroon-500 transition shadow-lg hover:scale-105 duration-300"
            >
              Get Involved Today
            </Link>
            <Link
              href="/committees"
              className="px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition backdrop-blur-sm hover:scale-105 duration-300"
            >
              Our Structure
            </Link>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <ArrowRight className="rotate-90" />
        </motion.div>
      </section>

      {/* Active Committees Preview */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-4xl md:text-5xl text-maroon">Active Committees</h2>
          <div className="w-24 h-1 bg-maroon mx-auto" />
          <p className="text-stone-600 max-w-2xl mx-auto">
            Our specialized committees work tirelessly to address specific areas of campus life and student needs.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { title: "Food & Pricing", icon: Users, desc: "Ensuring quality dining options and fair pricing." },
            { title: "Welfare", icon: Heart, desc: "Dedicated to student mental health and financial aid." },
            { title: "Judicial Affairs", icon: Scale, desc: "Upholding the student constitution and fair practices." },
            { title: "Campus Events", icon: Calendar, desc: "Organizing university-wide festivals and seminars." },
          ].map((item, idx) => (
            <motion.div variants={fadeIn} key={idx} className="group">
              <Link href="/committees" className="block h-full bg-white border border-stone-200 p-8 rounded-2xl hover:shadow-xl hover:border-maroon/20 hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-cream-300 rounded-xl flex items-center justify-center text-maroon mb-6 group-hover:bg-maroon group-hover:text-white transition-colors">
                  <item.icon size={24} />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-3 group-hover:text-maroon transition-colors">{item.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {item.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-12">
          <Link href="/committees" className="group flex items-center gap-2 text-maroon font-bold tracking-wide border-b border-maroon pb-1 hover:text-maroon-700 transition">
            VIEW ALL COMMITTEES <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-cream-100 py-24 -mx-4 sm:-mx-8 lg:-mx-[cal(50vw-50%)] px-4 sm:px-8 lg:px-[cal(50vw-50%)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-maroon mb-4">Featured Projects</h2>
              <p className="text-stone-600">Making a tangible impact on student life today.</p>
            </div>
            <Link href="/projects" className="hidden md:flex items-center gap-2 text-stone-500 hover:text-maroon transition font-medium">
              View All Initiatives <ArrowRight size={16} />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="text-center py-20 text-stone-500">Loading projects...</div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-20 text-stone-500 italic">No featured projects yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((project, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-2xl aspect-[4/5] shadow-lg">
                  {/* Background: Image or Fallback Color */}
                  {project.image_url ? (
                    <div className="absolute inset-0 bg-stone-900">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-60"
                      />
                    </div>
                  ) : (
                    <div className={`absolute inset-0 ${getFallbackBg(idx)} group-hover:scale-110 transition duration-700`} />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-6 left-6">
                    <span className={`px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                    <h3 className="font-serif text-2xl text-white mb-3">{project.title}</h3>
                    <p className="text-white/80 text-sm mb-6 opacity-0 group-hover:opacity-100 transition duration-300 delay-100 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Link handling */}
                    {project.link ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition cursor-pointer">
                        <ArrowUpRight size={20} />
                      </a>
                    ) : (
                      <Link href="/projects" className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition cursor-pointer">
                        <ArrowUpRight size={20} />
                      </Link>
                    )}
                  </div>
                  {/* Make whole card clickable if link exists */}
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 cursor-pointer"></a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="relative overflow-hidden rounded-3xl bg-[#3E000C] text-center py-24 px-4 bg-cover bg-center"
        style={{ backgroundImage: 'url(/SecondPic.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#3E000C]/80" /> {/* Overlay for readability */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-maroon-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl text-white">Your Participation Defines Our Success.</h2>
          <p className="text-cream-200 text-lg leading-relaxed">
            Join over 5,000 students already engaged in shaping the future of our university. Whether you want to lead a committee or share a suggestion, your voice matters.
          </p>
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10 max-w-2xl mx-auto">
            {[
              { label: "Committees", val: "15+" },
              { label: "Events", val: "500+" },
              { label: "Support", val: "24/7" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                <div className="text-xs font-bold tracking-widest uppercase text-maroon-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
