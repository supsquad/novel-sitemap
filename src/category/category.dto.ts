import { ApiProperty } from '@nestjs/swagger';
import { EntityDto, ResponseDto } from 'src/core/base.dto';

export class CategoryDto extends EntityDto {
  @ApiProperty()
  slug: string;

  @ApiProperty()
  name: string;
}

export class CategoryAllResponseDto extends ResponseDto {
  @ApiProperty()
  data: CategoryDto[];
}
