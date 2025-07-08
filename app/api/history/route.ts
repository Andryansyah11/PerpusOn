import { NextResponse } from 'next/server'
import { readData } from '@/lib/readWrite'

// Data akan diambil dari file JSON
export async function GET() {
  const data = await readData('books.json')

  return NextResponse.json({
    history: data.history || [],
    borrowCounts: data.borrowCounts || {}
  })
}
