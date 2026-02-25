'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'
import type ReCAPTCHAType from 'react-google-recaptcha'
import { supabase } from '@/lib/supabaseClient'

interface FeedbackFormProps {
    type: 'complaint' | 'suggestion'
}

export default function FeedbackForm({ type }: FeedbackFormProps) {
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const [captchaToken, setCaptchaToken] = useState<string | null>(null)
    const recaptchaRef = useRef<ReCAPTCHAType>(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        contact_email: ''
    })

    // Determine label based on type
    const isComplaint = type === 'complaint'
    const titleLabel = isComplaint ? "What's the issue?" : "What's your idea?"
    const descLabel = isComplaint ? "Describe the problem in detail" : "Tell us more about your suggestion"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setStatus('idle')
        setErrorMessage('')

        try {
            if (!captchaToken) {
                throw new Error('Please complete the CAPTCHA.')
            }

            const response = await fetch('/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    contact_email: formData.contact_email,
                    captchaToken,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Submission failed')
            }

            setStatus('success')
            setFormData({ title: '', description: '', category: 'General', contact_email: '' })
            setCaptchaToken(null)
            recaptchaRef.current?.reset()
        } catch (error: any) {
            console.error('Submission error:', error)
            setStatus('error')
            setErrorMessage(error.message || 'Something went wrong. Check console/terminal.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                {isComplaint ? 'Lodge a Complaint' : 'Make a Suggestion'}
            </h3>

            {status === 'success' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 p-6 rounded-xl flex flex-col items-center text-center"
                >
                    <CheckCircle size={48} className="mb-4" />
                    <h4 className="text-xl font-bold mb-2">Received!</h4>
                    <p>Your {type} has been submitted. We'll look into it shortly.</p>
                    <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-semibold underline">Submit another</button>
                </motion.div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                        <select
                            className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>General</option>
                            <option>Academic</option>
                            <option>Welfare</option>
                            <option>Infrastructure</option>
                            <option>Transport</option>
                            <option>Cafeteria</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{titleLabel}</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder={isComplaint ? "e.g. Broken projector in Room 301" : "e.g. Open library 24/7"}
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Details</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder={descLabel}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Email (Optional)</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="If you want to receive updates"
                            value={formData.contact_email}
                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        />
                    </div>

                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            <span>{errorMessage || "Failed to submit. Please ensure database is set up."}</span>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                            onChange={(token: string | null) => setCaptchaToken(token)}
                            onExpired={() => setCaptchaToken(null)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !captchaToken}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? 'Sending...' : 'Submit Form'} <Send size={18} />
                    </button>
                </form>
            )}
        </div>
    )
}
