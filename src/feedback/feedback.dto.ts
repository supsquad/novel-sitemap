import { ApiProperty } from '@nestjs/swagger';
import { EntityDto, ResponseDto } from 'src/core/base.dto';

export class CreateFeedbackBodyDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;
}

export class FeedbackDto extends EntityDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;
}

export class FeedbackResponseDto extends ResponseDto {
  @ApiProperty()
  data: FeedbackDto;
}
