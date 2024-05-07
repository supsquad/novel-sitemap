import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NovelTask } from './novel.task';
import config from '../core/axios.config';

@Module({
  imports: [HttpModule.register(config)],
  providers: [NovelTask],
})
export class NovelModule {}
