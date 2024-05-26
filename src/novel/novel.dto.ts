import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { AuthorDto } from 'src/author/author.dto';
import {
  EntityDto,
  PaginationDto,
  PaginationQueryDto,
  ParamDto,
  ResponseDto,
} from 'src/core/base.dto';

export class ListNovelsPaginationQueryDto extends PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  tags?: string[];

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  categories?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  recent?: boolean;
}

export class GetNovelParamDto extends ParamDto {
  @ApiProperty()
  @Matches('[a-z0-9-]+')
  slug: string;
}

export class ListNovelChaptersParamDto extends ParamDto {
  @ApiProperty()
  @Matches('[a-z0-9-]+')
  slug: string;
}

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

  @ApiProperty()
  categories: string[];

  @ApiProperty({ required: false, nullable: true })
  authors: AuthorDto[];
}

export class NovelPaginationDto extends PaginationDto {
  @ApiProperty()
  data: NovelDto[];
}

export class ListNovelsResponseDto extends ResponseDto {
  @ApiProperty()
  data: NovelPaginationDto;
}

export class NovelResponseDto extends ResponseDto {
  @ApiProperty()
  data: NovelDto;
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

export class GetChapterBySlugParamDto extends ParamDto {
  @ApiProperty()
  @Matches('[a-z0-9-]+')
  novelSlug: string;

  @ApiProperty()
  @Matches('[a-z0-9-]+')
  chapterSlug: string;
}

export class GetChapterBySequenceParamDto extends ParamDto {
  @ApiProperty()
  @Matches('[a-z0-9-]+')
  slug: string;

  @ApiProperty()
  @Matches('[0-9]+')
  sequence: number;
}
