'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Type definitions
type Book = {
  id: number
  title: string
  author: string
  image?: string
}

type BorrowedBook = Book & { quantity: number }

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([])
  const [borrowed, setBorrowed] = useState<BorrowedBook[]>([])
  const [newBook, setNewBook] = useState({ title: '', author: '', image: '' })
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch('/api/books')
      const data = await res.json()
      setBooks(data) // ✅ BENAR

    }

    fetchBooks()

    const stored = localStorage.getItem('borrowed')
    if (stored) setBorrowed(JSON.parse(stored))
  }, [])
  const handleBorrow = async (book: Book) => {
    try {
      const res = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      })

      if (!res.ok) {
        const errMsg = await res.text()
        throw new Error('Gagal meminjam buku: ' + errMsg)
      }

      const data = await res.json()
      setBorrowed(data.borrowed)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Terjadi kesalahan saat meminjam buku.')
    }
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Yakin ingin menghapus buku ini?')
    if (!confirmDelete) return

    try {
      const res = await fetch('/api/books', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error('Gagal menghapus buku')

      const updated = await fetch('/api/books').then((r) => r.json())
      setBooks(updated)

    } catch (err) {
      alert('Terjadi kesalahan saat menghapus buku.')
      console.error(err)
    }
  }

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

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Gagal menambah buku')
      }

      // Ambil ulang buku dari backend
      const updated = await fetch('/api/books').then((r) => r.json())
      setBooks(updated.books || [])

    } catch (err: any) {
      alert(err.message)
    }


    setNewBook({ title: '', author: '', image: '' })
    setFile(null)
  }
  const [preview, setPreview] = useState<string | null>(null)
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


      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">📚 Daftar Buku</h1>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <li
              key={book.id}
              className="bg-gray-50 border border-blue-200 rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                {book.image && (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-75 object-fill rounded-md mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
              </div>
              <button
                onClick={() => handleBorrow(book)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
              >
                Pinjam Buku
              </button>
              <button
                onClick={() => handleDelete(book.id)}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
              >
                Hapus Buku
              </button>

            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
