import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core/base.service';
import { FeedbackEntity } from 'src/entities/feedback.entity';
import { CreateFeedbackBodyDto } from './feedback.dto';

@Injectable()
export class FeedbackService extends BaseService<FeedbackEntity> {
  constructor(
    readonly em: EntityManager,

    @InjectRepository(FeedbackEntity)
    readonly repo: EntityRepository<FeedbackEntity>,
  ) {
    super(em, repo);
  }

  async createFeedback(body: CreateFeedbackBodyDto) {
    return await this.create(body);
  }
}
