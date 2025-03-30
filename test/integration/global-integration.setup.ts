import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

console.log(process.env.DATABASE_URL);

module.exports = async () => {
  const prisma = new PrismaClient();
  try {
    console.log('Executing migrations before all integration tests');
    execSync('npm run migrate:integration');
    console.log('Migrations executed successfully.');
  } catch (error) {
    console.error('Error executing migrations:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
