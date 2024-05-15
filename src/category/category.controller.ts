import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryAllResponseDto } from './category.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(readonly categoryService: CategoryService) {}

  @ApiOkResponse({
    type: CategoryAllResponseDto,
  })
  @Get('all')
  async all() {
    const data = await this.categoryService.all();
    return this.categoryService.toResponse(data);
  }
}
