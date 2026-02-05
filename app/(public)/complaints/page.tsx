'use client'

import { useState } from 'react'
import FeedbackForm from '@/components/FeedbackForm'

export default function ComplaintsPage() {
    const [activeTab, setActiveTab] = useState<'complaint' | 'suggestion'>('complaint')

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Your Voice Matters</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Helps us improve campus life. Flag issues or suggest new initiatives.
                </p>
            </div>

            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex">
                    <button
                        onClick={() => setActiveTab('complaint')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'complaint'
                                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Lodge Complaint
                    </button>
                    <button
                        onClick={() => setActiveTab('suggestion')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'suggestion'
                                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-white'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        Make Suggestion
                    </button>
                </div>
            </div>

            <FeedbackForm
                key={activeTab} // Force re-render on tab change to reset state
                type={activeTab}
            />
        </div>
    )
}
