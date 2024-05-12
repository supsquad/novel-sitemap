import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NovelTask } from './novel.task';
import config from '../core/axios.config';
import { NovelController } from './novel.controller';
import { NovelService } from './novel.service';

@Module({
  imports: [HttpModule.register(config)],
  controllers: [NovelController],
  providers: [NovelTask, NovelService],
})
export class NovelModule {}
