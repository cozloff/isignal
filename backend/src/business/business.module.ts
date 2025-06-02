import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService],
  imports: [DrizzleModule],
})
export class BusinessModule {}
