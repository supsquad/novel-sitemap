import {
  BaseEntity,
  EntityManager,
  EntityName,
  FilterQuery,
  FindOptions,
} from '@mikro-orm/postgresql';
import { PaginationQueryDto } from './base.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseService {
  constructor(private readonly em: EntityManager) {}

  public toResponse(data: any) {
    return { message: 'Thành công', data };
  }

  public async list(
    entity: EntityName<NoInfer<BaseEntity>>,
    query: PaginationQueryDto,
    where: FilterQuery<NoInfer<BaseEntity>> = {},
    options: FindOptions<NoInfer<BaseEntity>> = {},
  ) {
    const page = query.page;
    const size = query.size;
    const offset = page * (size - 1);
    const [data, count] = await this.em.findAndCount(entity, where, {
      limit: size,
      offset: offset,
      ...options,
    });
    const last = Math.ceil(count / size);
    const previous = page === 1 ? null : page - 1;
    const next = page === last ? null : page + 1;
    return { page, size, previous, next, last, count, data };
  }

  public async all(
    entity: EntityName<NoInfer<BaseEntity>>,
    where: FilterQuery<NoInfer<BaseEntity>> = {},
    options: FindOptions<NoInfer<BaseEntity>> = {},
  ) {
    const data = await this.em.find(entity, where, options);
    return data;
  }
}
