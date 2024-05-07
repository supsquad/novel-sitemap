import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CategoryTask } from './category.task';
import config from '../core/axios.config';

@Module({
  imports: [HttpModule.register(config)],
  providers: [CategoryTask],
})
export class CategoryModule {}
