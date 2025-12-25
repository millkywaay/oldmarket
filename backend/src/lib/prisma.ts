import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

// Konfigurasi Pool dengan SSL agar tidak error "SSL connection is required"
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false // Izinkan koneksi ke penyedia cloud
  }
});

const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter, // Wajib di Prisma v7
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;