import Link from 'next/link'
import { ArrowRight, Users } from 'lucide-react'

interface CommitteeProps {
    name: string
    description: string
    href: string
    icon?: any
}

export default function CommitteeCard({ name, description, href }: CommitteeProps) {
    return (
        <Link href={href} className="group block">
            <div className="glass h-full p-6 rounded-2xl hover:bg-white/20 transition duration-300 border border-white/10 flex flex-col">
                <div className="mb-4 text-blue-500 group-hover:scale-110 transition duration-300 origin-left">
                    <Users size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-blue-500 transition">
                    {name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow">
                    {description}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    View Details <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    )
}
