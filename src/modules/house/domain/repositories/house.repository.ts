import { CreateHouseDto } from '../dtos/create-house.dto';
import { HouseEntity } from '../entities/house.entity';

export abstract class HouseRepository {
  abstract create(dto: CreateHouseDto): Promise<HouseEntity>;
  abstract getByCondominiumId(condominiumId: number): Promise<HouseEntity[]>;
  abstract delete(houseId: number): Promise<void>;
  abstract patch(
    houseId: number,
    houseNumber: string,
    ownerId: number,
  ): Promise<HouseEntity>;
}
