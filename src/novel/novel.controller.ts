import { Controller, Get, Query } from '@nestjs/common';
import { NovelService } from './novel.service';
import { PaginationQueryDto } from 'src/core/base.dto';
import { NovelEntity } from 'src/entities/novel.entity';
import { NovelListResponseDto } from './novel.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('novel')
export class NovelController {
  constructor(private novelService: NovelService) {}

  @ApiOkResponse({
    type: NovelListResponseDto,
  })
  @Get('')
  async list(@Query() query: PaginationQueryDto) {
    const data = await this.novelService.list(NovelEntity, query);
    return this.novelService.toResponse(data);
  }
}
