import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './core/database.module';

@Module({
  imports: [DatabaseModule, ScheduleModule.forRoot(), CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
