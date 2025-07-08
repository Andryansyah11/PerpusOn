// lib/readWrite.ts
import { promises as fs } from 'fs'
import path from 'path'

export async function readData(file: string) {
  const filePath = path.resolve(process.cwd(), 'data', file)
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function writeData(file: string, data: any) {
  const filePath = path.resolve(process.cwd(), 'data', file)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}
