import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CategoryTask } from './category.task';
import config from '../core/axios.config';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/entities/category.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    HttpModule.register(config),
    MikroOrmModule.forFeature([CategoryEntity]),
  ],
  controllers: [CategoryController],
  providers: [CategoryTask, CategoryService],
})
export class CategoryModule {}
