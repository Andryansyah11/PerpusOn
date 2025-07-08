import { NextResponse } from 'next/server'
import { readData, writeData } from '@/lib/readWrite'

export async function POST(req: Request) {
  const body = await req.json()
  const { id, quantity } = body

  if (!id || !quantity || quantity <= 0) {
    return NextResponse.json({ error: 'Data pengembalian tidak valid' }, { status: 400 })
  }

  const data = await readData('books.json')
  const borrowed = data.borrowed || []

  const book = borrowed.find((b: any) => b.id === id)
  if (!book || book.quantity < quantity) {
    return NextResponse.json({ error: 'Jumlah pengembalian melebihi jumlah pinjam' }, { status: 400 })
  }

  const updated = borrowed
    .map((b: any) =>
      b.id === id ? { ...b, quantity: b.quantity - quantity } : b
    )
    .filter((b: any) => b.quantity > 0)

  const newData = { ...data, borrowed: updated }
  await writeData(' books.json', newData)

  return NextResponse.json({ message: 'Buku berhasil dikembalikan', borrowed: updated })
}
