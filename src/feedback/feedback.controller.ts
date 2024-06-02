import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CreateFeedbackBodyDto, FeedbackResponseDto } from './feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(readonly feedbackService: FeedbackService) {}

  @ApiOkResponse({
    type: FeedbackResponseDto,
  })
  @Post('')
  async listNovels(@Body() body: CreateFeedbackBodyDto) {
    const data = await this.feedbackService.createFeedback(body);
    return this.feedbackService.toResponse(data);
  }
}
