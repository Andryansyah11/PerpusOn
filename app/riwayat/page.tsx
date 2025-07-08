'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Tipe data buku
type Book = {
  id: number
  title: string
  author: string
  image?: string
}

export default function RiwayatPage() {
  const [history, setHistory] = useState<Book[]>([])
  const [borrowCounts, setBorrowCounts] = useState<{ [id: number]: number }>({})

  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history)
        setBorrowCounts(data.borrowCounts)
      })
      .catch((err) => console.error('Gagal fetch data riwayat:', err))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 py-10 px-4">
      <nav className="max-w-6xl mx-auto mt-6 mb-8 flex flex-wrap justify-between items-center bg-white shadow-lg rounded-2xl px-8 py-4 text-blue-800 font-semibold">
        <div className="flex gap-6 items-center text-sm md:text-base">
          <Link href="/" className="hover:text-blue-600 transition duration-200">
            🏠 Beranda
          </Link>
          <Link href="/peminjaman" className="hover:text-blue-600 transition duration-200">
            📘 Peminjaman
          </Link>
          <Link href="/riwayat" className="hover:text-blue-600 transition duration-200">
            🕘 Riwayat
          </Link>
          <Link href="/tambah" className="hover:text-blue-600 transition duration-200">
            ➕ Tambah Buku
          </Link>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 transition duration-200 text-sm md:text-base"
          >
            🚪 Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-8">🕘 Riwayat Peminjaman</h1>

        {history.length === 0 ? (
          <p className="text-gray-500 text-lg">Belum ada histori peminjaman.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {history.map((book) => (
              <li
                key={book.id}
                className="bg-gray-100 border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                {book.image && (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <p className="text-lg font-semibold text-gray-800">{book.title}</p>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-sm text-blue-700 font-medium mt-1">
                  Dipinjam: {borrowCounts[book.id] || 0}x
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
