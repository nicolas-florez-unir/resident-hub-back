import { FineStatus as PrismaFineStatus } from '@prisma/client';
import { FineStatus as DomainFineStatus } from 'src/modules/fine/domain/enums/fine-status.enum';

export class PrismaFineStatusMapper {
  static toDomain(prismaFineStatus: PrismaFineStatus): DomainFineStatus {
    switch (prismaFineStatus) {
      case PrismaFineStatus.pending:
        return DomainFineStatus.PENDING;
      case PrismaFineStatus.paid:
        return DomainFineStatus.PAID;
      case PrismaFineStatus.appealed:
        return DomainFineStatus.APPEALED;
      default:
        throw new Error(`Unknown FineStatus: ${prismaFineStatus}`);
    }
  }

  static toPrisma(domainFineStatus: DomainFineStatus): PrismaFineStatus {
    switch (domainFineStatus) {
      case DomainFineStatus.PENDING:
        return PrismaFineStatus.pending;
      case DomainFineStatus.PAID:
        return PrismaFineStatus.paid;
      case DomainFineStatus.APPEALED:
        return PrismaFineStatus.appealed;
      default:
        throw new Error(`Unknown FineStatus: ${domainFineStatus}`);
    }
  }
}
