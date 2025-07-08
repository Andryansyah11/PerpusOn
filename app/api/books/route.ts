// app/api/books/route.ts
import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/readWrite'

export async function GET() {
  const data = await readData('books.json')
  return NextResponse.json(data.books || [])
}


export async function POST(req: Request) {
  const body = await req.json()
  const { id, title, author, image } = body

  if (!id || !title || !author || !image) {
    return NextResponse.json({ error: 'Data buku tidak lengkap' }, { status: 400 })
  }

  const data = await readData('books.json')
  if (!data.books) data.books = []

  if (data.books.find((b: any) => b.id === id)) {
    return NextResponse.json({ error: 'ID buku sudah ada' }, { status: 409 })
  }

  const newBook = { id, title, author, image }
  data.books.push(newBook)

  await writeData('books.json', data)

  return NextResponse.json({ message: 'Buku berhasil ditambahkan', book: newBook })
}


export async function DELETE(req: Request) {
  const { id } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 })
  }

  const data = await readData('books.json')
  data.books = data.books?.filter((b: any) => b.id !== id) || []

  await writeData('books.json', data)

  return NextResponse.json({ message: 'Buku berhasil dihapus' })
}

