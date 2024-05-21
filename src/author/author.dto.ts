import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { EntityDto, ParamDto, ResponseDto } from 'src/core/base.dto';

export class AuthorDto extends EntityDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class GetAuthorParamDto extends ParamDto {
  @ApiProperty()
  @Matches('[a-z0-9-]+')
  slug: string;
}

export class GetAuthorResponseDto extends ResponseDto {
  @ApiProperty()
  data: AuthorDto;
}
