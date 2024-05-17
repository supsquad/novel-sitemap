import { Controller, Get, Param } from '@nestjs/common';
import { AuthorService } from './author.service';
import { GetAuthorParamDto, GetAuthorResponseDto } from './author.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('author')
export class AuthorController {
  constructor(readonly authorService: AuthorService) {}

  @ApiOkResponse({
    type: GetAuthorResponseDto,
  })
  @Get(':slug')
  async all(@Param() param: GetAuthorParamDto) {
    const data = await this.authorService.getAuthorBySlug(param.slug);
    return this.authorService.toResponse(data);
  }
}
