import { Currency as PrismaCurrency } from '@prisma/client';
import { Currency as DomainCurrency } from 'src/modules/fine/domain/enums/currency.enum';

export class PrismaCurrencyMapper {
  static toDomain(prismaCurrency: PrismaCurrency): DomainCurrency {
    switch (prismaCurrency) {
      case PrismaCurrency.eur:
        return DomainCurrency.EUR;
      case PrismaCurrency.usd:
        return DomainCurrency.USD;
      case PrismaCurrency.cop:
        return DomainCurrency.COP;
      default:
        throw new Error(`Unknown Currency: ${prismaCurrency}`);
    }
  }

  static toPrisma(domainCurrency: DomainCurrency): PrismaCurrency {
    switch (domainCurrency) {
      case DomainCurrency.EUR:
        return PrismaCurrency.eur;
      case DomainCurrency.USD:
        return PrismaCurrency.usd;
      case DomainCurrency.COP:
        return PrismaCurrency.cop;
      default:
        throw new Error(`Unknown Currency: ${domainCurrency}`);
    }
  }
}
