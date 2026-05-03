const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  // Create admin user if not exists
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        id: 'admin-123',
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created: admin@example.com / admin123');
  } else {
    console.log('⚠️ Admin user already exists');
  }

  // Create member user if not exists
  const memberEmail = 'member@example.com';
  const existingMember = await prisma.user.findUnique({ where: { email: memberEmail } });
  if (!existingMember) {
    const memberHashedPassword = await bcrypt.hash('member123', salt);
    await prisma.user.create({
      data: {
        id: 'member-123',
        name: 'Member User',
        email: memberEmail,
        password: memberHashedPassword,
        role: 'MEMBER',
      },
    });
    console.log('✅ Member user created: member@example.com / member123');
  } else {
    console.log('⚠️ Member user already exists');
  }

  console.log('✅ Seeding complete!');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

