import { CreateFineDto } from '../dtos/create-fine.dto';
import { UpdateFineDto } from '../dtos/update-fine.dto';
import { FineEntity } from '../entities/fine.entity';

export abstract class FineRepository {
  abstract createFine(createFineDto: CreateFineDto): Promise<FineEntity>;

  abstract findFineById(fineId: number): Promise<FineEntity | null>;

  abstract deleteFine(fineId: number): Promise<void>;

  abstract findFinesByHouseOwner(houseOwnerId: number): Promise<FineEntity[]>;

  abstract findByCondominiumId(condominiumId: number): Promise<FineEntity[]>;

  abstract update(updateFineDto: UpdateFineDto): Promise<FineEntity>;
}
