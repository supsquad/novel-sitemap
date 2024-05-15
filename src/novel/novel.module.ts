import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NovelTask } from './novel.task';
import config from '../core/axios.config';
import { NovelController } from './novel.controller';
import { NovelService } from './novel.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NovelEntity } from 'src/entities/novel.entity';
import { NovelChapterService } from './novelChapter.service';
import { NovelChapterEntity } from 'src/entities/novelChapter.entity';

@Module({
  imports: [
    HttpModule.register(config),
    MikroOrmModule.forFeature([NovelEntity, NovelChapterEntity]),
  ],
  controllers: [NovelController],
  providers: [NovelTask, NovelService, NovelChapterService],
})
export class NovelModule {}
