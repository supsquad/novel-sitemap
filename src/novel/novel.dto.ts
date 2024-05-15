import { ApiProperty } from '@nestjs/swagger';
import { EntityDto, PaginationDto, ResponseDto } from 'src/core/base.dto';

export class NovelDto extends EntityDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false })
  tags: string[];

  @ApiProperty()
  chapterCount: number;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  image?: string;

  @ApiProperty()
  score: number;
}

export class NovelPaginationDto extends PaginationDto {
  @ApiProperty()
  data: NovelDto[];
}

export class NovelListResponseDto extends ResponseDto {
  @ApiProperty()
  data: NovelPaginationDto;
}
