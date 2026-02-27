import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const prismaClientSingleton = () => {
  // 1. สร้าง Connection Pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. สร้าง Adapter
  const adapter = new PrismaPg(pool)

  // 3. ส่ง Adapter ให้ PrismaClient
  return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
