// app/api/borrow/route.ts
import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/readWrite'

export async function POST(req: Request) {
  const body = await req.json()
  const { id, title, author, image } = body

  if (!id || !title || !author) {
    return NextResponse.json({ error: 'Data buku tidak lengkap' }, { status: 400 })
  }

  const data = await readData('books.json')

  if (!data.borrowed) data.borrowed = []
  if (!data.history) data.history = []
  if (!data.borrowCounts) data.borrowCounts = {}

  const existing = data.borrowed.find((b: any) => b.id === id)
  if (existing) {
    existing.quantity += 1
  } else {
    data.borrowed.push({ id, title, author, image, quantity: 1 })
  }

  if (!data.history.find((b: any) => b.id === id)) {
    data.history.push({ id, title, author, image })
  }

  data.borrowCounts[id] = (data.borrowCounts[id] || 0) + 1

  await writeData('books.json', data)

  return NextResponse.json({ message: 'Buku berhasil dipinjam', borrowed: data.borrowed })
}

export async function GET() {
  const data = await readData('books.json')
  return NextResponse.json({ borrowed: data.borrowed || [] })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, quantity } = body

  if (!id || quantity === undefined || quantity <= 0) {
    return NextResponse.json({ error: 'Input tidak valid' }, { status: 400 })
  }

  const data = await readData('books.json')
  const index = data.borrowed.findIndex((b: any) => b.id === id)

  if (index === -1 || quantity > data.borrowed[index].quantity) {
    return NextResponse.json({ error: 'Jumlah melebihi yang dipinjam' }, { status: 400 })
  }

  data.borrowed[index].quantity -= quantity

  if (data.borrowed[index].quantity <= 0) {
    data.borrowed.splice(index, 1)
  }

  await writeData('books.json', data)
  return NextResponse.json({ borrowed: data.borrowed })
}
