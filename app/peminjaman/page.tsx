'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Type definitions
type Book = {
    id: number
    title: string
    author: string
}

type BorrowedBook = Book & { quantity: number }

export default function PeminjamanPage() {
    const [borrowed, setBorrowed] = useState<BorrowedBook[]>([])
    const [returnCounts, setReturnCounts] = useState<{ [id: number]: number }>({})

    useEffect(() => {
        fetch('/api/borrow')
            .then(res => res.json())
            .then(data => setBorrowed(data.borrowed || []))
    }, [])

    const handleReturn = async (id: number) => {
        const returnQty = returnCounts[id] ?? 0
        const book = borrowed.find((b) => b.id === id)

        if (!book || returnQty <= 0 || returnQty > book.quantity) return

        try {
            const res = await fetch('/api/borrow', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, quantity: returnQty }),
            })

            if (!res.ok) throw new Error('Gagal mengembalikan buku')

            const data = await res.json()
            setBorrowed(data.borrowed)
            setReturnCounts({ ...returnCounts, [id]: 1 }) // Reset ke default
        } catch (err) {
            console.error(err)
        }
    }
    const handleLogout = () => {
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    const handleInputChange = (id: number, value: number) => {
        setReturnCounts({ ...returnCounts, [id]: value })
    }

    const totalBooks = borrowed.reduce((sum, b) => sum + b.quantity, 0)

    return (<main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
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
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12"> <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">📘 Peminjaman Buku</h1>

            {borrowed.length === 0 ? (
                <p className="text-gray-600 mb-6 text-lg">Belum ada buku yang dipinjam.</p>
            ) : (
                <>
                    <div className="mb-8 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold shadow-sm">
                        Total buku dipinjam: <span className="font-bold text-xl">{totalBooks}</span>
                    </div>

                    <ul className="space-y-6 mb-10">
                        {borrowed.map((book) => (
                            <li
                                key={book.id}
                                className="bg-gray-50 border border-blue-200 rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                                    <p className="text-gray-600">{book.author}</p>
                                    <p className="mt-1 text-sm text-blue-600 font-medium">Jumlah: {book.quantity}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min={''}
                                        max={book.quantity}
                                        value={returnCounts[book.id] === undefined ? '' : returnCounts[book.id]}
                                        onChange={(e) =>
                                            handleInputChange(book.id, parseInt(e.target.value) || 0)
                                        }
                                        className="w-24 px-3 py-1 border border-blue-300 text-blue-900 text-base font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <button
                                        onClick={() => handleReturn(book.id)}
                                        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                                    >
                                        Kembalikan
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    </main>


    )
}
