'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function TambahBukuPage() {
    const router = useRouter()

    const [newBook, setNewBook] = useState({ title: '', author: '', image: '' })
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleImageUpload = async () => {
        if (!file) return ''
        const formData = new FormData()
        formData.append('image', file)

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        const result = await res.json()
        return result.url
    }

    const handleAddBook = async () => {
        if (!newBook.title || !newBook.author || !file) return alert('Lengkapi data buku')

        const imageUrl = await handleImageUpload()

        const newEntry = {
            id: Date.now(),
            title: newBook.title,
            author: newBook.author,
            image: imageUrl,
        }

        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry),
        })

        if (res.ok) {
            alert('Buku berhasil ditambahkan!')
            router.push('/')
        } else {
            alert('Gagal menambahkan buku')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user')
        window.location.href = '/login'
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
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


            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-6">➕ Tambah Buku Baru</h1>

                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Judul buku"
                        value={newBook.title}
                        onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                        className="border rounded-lg px-4 py-2"
                    />
                    <input
                        type="text"
                        placeholder="Penulis"
                        value={newBook.author}
                        onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                        className="border rounded-lg px-4 py-2"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const selected = e.target.files?.[0] || null
                            setFile(selected)
                            setPreview(selected ? URL.createObjectURL(selected) : null)
                        }}
                        className="border rounded-lg px-4 py-2"
                    />

                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full max-w-xs h-48 object-cover rounded-lg border mt-2"
                        />
                    )}

                    <button
                        onClick={handleAddBook}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
                    >
                        Simpan Buku
                    </button>
                </div>
            </div>
        </main>
    )
}
