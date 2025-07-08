'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSignup = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, type: 'signup' }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      return
    }

    alert('Signup berhasil, silakan login!')
    router.push('/login')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="bg-white shadow-2xl rounded-3xl px-8 py-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">Buat Akun Baru</h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-300 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-800"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-800"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow transition duration-200"
          >
            Daftar
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login sekarang
          </a>
        </p>
      </div>
    </main>
  )
}
