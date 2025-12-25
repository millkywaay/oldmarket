import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin', 10);
  const userPassword = await bcrypt.hash('user', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@gmail.com',
      phone: '081234567890',
      password_hash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      name: 'user',
      email: 'user@gmail.com',
      phone: '081298765432',
      password_hash: userPassword,
      role: Role.USER,
    },
  });

  console.log('Seed berhasil dibuat:');
  console.log({ admin, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
