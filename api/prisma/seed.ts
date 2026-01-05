import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Admin user credentials
  const adminEmail = 'admin@example.com';
  const adminPassword = 'password123';
  
  // Regular user credentials
  const userEmail = 'user@example.com';
  const userPassword = 'password123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists');
    console.log(`   Email: ${existingAdmin.email}`);
  } else {
    // Create admin user
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedAdminPassword,
        role: 'ADMIN',
        passwordSet: true,
        isActive: true,
      },
    });
    console.log('✅ Admin user created');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${adminPassword}`);
  }

  // Check if regular user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (existingUser) {
    console.log('\n⚠️  Regular user already exists');
    console.log(`   Email: ${existingUser.email}`);
  } else {
    // Create regular user
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        passwordHash: hashedUserPassword,
        role: 'USER',
        passwordSet: true,
        isActive: true,
      },
    });
    console.log('\n✅ Regular user created');
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${userPassword}`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📝 LOGIN CREDENTIALS');
  console.log('='.repeat(50));
  console.log('\n👑 ADMIN LOGIN:');
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('\n👤 USER LOGIN:');
  console.log(`   Email:    ${userEmail}`);
  console.log(`   Password: ${userPassword}`);
  console.log('\n' + '='.repeat(50));
  console.log('\n✨ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
