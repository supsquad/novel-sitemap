import { ApiProperty } from '@nestjs/swagger';
import { EntityDto, PaginationDto, ResponseDto } from 'src/core/base.dto';

export class NovelDto extends EntityDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true })
  tags: string[];

  @ApiProperty()
  chapterCount: number;

  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
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

export class NovelChapterDto extends EntityDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  sequence: number;

  @ApiProperty({ nullable: true })
  content: string;

  @ApiProperty()
  novel: number;
}

export class NovelChapterResponseDto extends ResponseDto {
  @ApiProperty()
  data: NovelChapterDto;
}
