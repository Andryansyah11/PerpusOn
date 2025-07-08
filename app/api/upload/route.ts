import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const data = await req.formData()
  const file = data.get('image') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${randomUUID()}-${file.name}`

  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  await writeFile(filepath, buffer)

  return NextResponse.json({ filename, url: `/uploads/${filename}` })
}
