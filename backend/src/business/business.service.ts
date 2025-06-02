import { Injectable, Inject } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { business } from 'src/drizzle/schema/business.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class BusinessService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}
  create(createBusinessDto: CreateBusinessDto) {
    return 'This action adds a new business';
  }

  async findAll() {
    return await this.db.select().from(business);
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return await this.db
      .update(business)
      .set({
        name: 'AAAAAAAAA',
      })
      .where(eq(business.id, id));
  }

  async remove(id: number) {
    return await this.db.delete(business).where(eq(business.id, id));
  }
}
