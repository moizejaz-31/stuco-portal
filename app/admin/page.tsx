'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/auth'
import Image from 'next/image'

export default function AdminLogin() {
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        const result = await login(formData)
        if (result.success) {
            router.push('/admin/dashboard')
        } else {
            setError('Invalid password')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFDFB]">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-stone-200">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto relative mb-4">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="font-serif text-3xl font-bold text-maroon">Admin Portal</h1>
                    <p className="text-stone-500 mt-2">Restricted Access</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                            Secure Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition"
                            placeholder="Enter admin key..."
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-lg">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-maroon text-white font-bold rounded-xl hover:bg-[#3E000C] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Access Dashboard
                    </button>

                    <div className="text-center">
                        <a href="/" className="text-sm text-stone-400 hover:text-maroon transition">
                            &larr; Return to Public Site
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )
}
