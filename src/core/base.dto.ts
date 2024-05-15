import { IsNumber, IsOptional } from 'class-validator';
import { Pagination } from './base.constants';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size: number = Pagination.PAGE_SIZE;
}

export class ResponseDto {
  @ApiProperty()
  message: string;
}

export class PaginationDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  last: number;

  @ApiProperty({ nullable: true })
  previous: number;

  @ApiProperty({ nullable: true })
  next: number;

  @ApiProperty()
  count: number;
}

export class EntityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ nullable: true })
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date;
}
