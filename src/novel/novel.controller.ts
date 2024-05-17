import { Controller, Get, Param, Query } from '@nestjs/common';
import { NovelService } from './novel.service';
import { PaginationQueryDto } from 'src/core/base.dto';
import {
  GetNovelParamDto,
  NovelChapterResponseDto,
  ListNovelsResponseDto,
  ListNovelsPaginationQueryDto,
  NovelResponseDto,
  ListNovelChaptersParamDto,
  GetChapterParamDto,
} from './novel.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { NovelChapterService } from './novelChapter.service';

@Controller('novel')
export class NovelController {
  constructor(
    readonly novelService: NovelService,
    readonly novelChapterService: NovelChapterService,
  ) {}

  @ApiOkResponse({
    type: ListNovelsResponseDto,
  })
  @Get('')
  async listNovels(@Query() query: ListNovelsPaginationQueryDto) {
    const data = await this.novelService.listNovels(query);
    return this.novelService.toResponse(data);
  }

  @ApiOkResponse({
    type: NovelResponseDto,
  })
  @Get(':slug')
  async getNovelBySlug(@Param() param: GetNovelParamDto) {
    const data = await this.novelService.getNovelBySlug(param.slug);
    return this.novelService.toResponse(data);
  }

  @Get(':slug/chapter')
  async listNovelChaptersBySlug(
    @Param() param: ListNovelChaptersParamDto,
    @Query() query: PaginationQueryDto,
  ) {
    const data = await this.novelChapterService.listNovelChaptersBySlug(
      param.slug,
      query,
    );
    return this.novelChapterService.toResponse(data);
  }

  @ApiOkResponse({
    type: NovelChapterResponseDto,
  })
  @Get(':novelSlug/chapter/:chapterSlug')
  async getChapterBySlug(@Param() param: GetChapterParamDto) {
    const data = await this.novelChapterService.getChapterBySlug(
      param.novelSlug,
      param.chapterSlug,
    );
    return this.novelChapterService.toResponse(data);
  }
}
