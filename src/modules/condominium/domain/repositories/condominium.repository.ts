import { CreateCondominiumDto } from '../dtos/create-condominium.dto';
import { CondominiumEntity } from '../entities/condominium.entity';

export abstract class CondominiumRepository {
  public abstract create(dto: CreateCondominiumDto): Promise<CondominiumEntity>;

  public abstract update(
    condominium: CondominiumEntity,
  ): Promise<CondominiumEntity | null>;

  public abstract findById(id: number): Promise<CondominiumEntity | null>;
}
