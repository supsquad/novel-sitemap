import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryAllResponseDto } from './category.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOkResponse({
    type: CategoryAllResponseDto,
  })
  @Get('all')
  async all() {
    const data = await this.categoryService.all(CategoryEntity);
    return this.categoryService.toResponse(data);
  }
}
