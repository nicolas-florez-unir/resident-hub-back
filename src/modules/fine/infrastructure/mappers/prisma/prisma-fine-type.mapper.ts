import { FineType as PrismaFineType } from '@prisma/client';
import { FineType as DomainFineType } from 'src/modules/fine/domain/enums/fine-type.enum';

export class PrismaFineTypeMapper {
  static toDomain(prismaFineType: PrismaFineType): DomainFineType {
    switch (prismaFineType) {
      case PrismaFineType.non_compliance:
        return DomainFineType.NON_COMPLIANCE;
      case PrismaFineType.late_payment:
        return DomainFineType.LATE_PAYMENT;
      default:
        throw new Error(`Unknown FineType: ${prismaFineType}`);
    }
  }

  static toPrisma(domainFineType: DomainFineType): PrismaFineType {
    switch (domainFineType) {
      case DomainFineType.NON_COMPLIANCE:
        return PrismaFineType.non_compliance;
      case DomainFineType.LATE_PAYMENT:
        return PrismaFineType.late_payment;
      default:
        throw new Error(`Unknown FineType: ${domainFineType}`);
    }
  }
}
