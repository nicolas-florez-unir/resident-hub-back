import { PrismaService } from '@common/database/prisma/prisma.service';

export class PrismaUtils {
  static async clearDatabase(prisma: PrismaService) {
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
    await prisma.$executeRaw`TRUNCATE TABLE users`;
    await prisma.$executeRaw`TRUNCATE TABLE condominiums`;
    await prisma.$executeRaw`TRUNCATE TABLE houses`;
    await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
  }
}
