import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { NovelService } from './novel.service';

@Controller('novel')
export class NovelController {
  constructor(private novelService: NovelService) {}

  @Get('')
  async list(@Res() res: Response, @Query('page') page?: number) {
    const currentPage = page ? page : 1;
    const novels = await this.novelService.list(currentPage);
    res.status(HttpStatus.OK).send(novels);
  }
}
