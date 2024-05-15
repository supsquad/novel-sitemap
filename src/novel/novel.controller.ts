import { Controller, Get, Param, Query } from '@nestjs/common';
import { NovelService } from './novel.service';
import { PaginationQueryDto } from 'src/core/base.dto';
import { NovelChapterResponseDto, NovelListResponseDto } from './novel.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { NovelChapterService } from './novelChapter.service';

@Controller('novel')
export class NovelController {
  constructor(
    readonly novelService: NovelService,
    readonly novelChapterService: NovelChapterService,
  ) {}

  @ApiOkResponse({
    type: NovelListResponseDto,
  })
  @Get('')
  async listNovels(@Query() query: PaginationQueryDto) {
    const data = await this.novelService.listNovels(query);
    return this.novelService.toResponse(data);
  }

  @ApiOkResponse({
    type: NovelListResponseDto,
  })
  @Get(':id(\\d+)')
  async getNovelById(@Param('id') id: number) {
    const data = await this.novelService.getNovelById(id);
    return this.novelService.toResponse(data);
  }

  @Get(':id(\\d+)/chapter')
  async listNovelChaptersById(
    @Param('id') id: number,
    @Query() query: PaginationQueryDto,
  ) {
    const data = await this.novelChapterService.listNovelChaptersById(
      id,
      query,
    );
    return this.novelChapterService.toResponse(data);
  }

  @ApiOkResponse({
    type: NovelChapterResponseDto,
  })
  @Get('chapter/:id(\\d+)')
  async getChapterById(@Param('id') id: number) {
    const data = await this.novelChapterService.getChapterById(id);
    return this.novelChapterService.toResponse(data);
  }
}
