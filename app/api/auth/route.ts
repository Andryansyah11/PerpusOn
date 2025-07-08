// app/api/auth/route.ts
import { readData, writeData } from '@/lib/readWrite'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { username, password, type } = await req.json()
  const data = await readData('users.json')
  if (!data.users) data.users = []

  if (type === 'signup') {
    if (data.users.find((u: any) => u.username === username)) {
      return NextResponse.json({ error: 'Username sudah terdaftar' }, { status: 400 })
    }
    const newUser = { id: Date.now(), username, password }
    data.users.push(newUser)
    await writeData('users.json', data)
    return NextResponse.json({ message: 'Signup berhasil' })
  }

  if (type === 'login') {
    const user = data.users.find((u: any) => u.username === username && u.password === password)
    if (!user) {
      return NextResponse.json({ error: 'Login gagal' }, { status: 401 })
    }
    return NextResponse.json({ message: 'Login berhasil', user })
  }

  return NextResponse.json({ error: 'Tipe request tidak valid' }, { status: 400 })
}
