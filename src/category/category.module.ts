import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CategoryTask } from './category.task';
import config from '../core/axios.config';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [HttpModule.register(config)],
  controllers: [CategoryController],
  providers: [CategoryTask, CategoryService],
})
export class CategoryModule {}
