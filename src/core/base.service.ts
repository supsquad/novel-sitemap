import {
  FindOptions,
  EntityManager,
  EntityRepository,
  ObjectQuery,
  PopulatePath,
  FindOneOptions,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './base.dto';
import { BaseEntity } from './base.entity';

@Injectable()
export abstract class BaseService<T extends BaseEntity> {
  constructor(
    readonly em: EntityManager,
    readonly repo: EntityRepository<T>,
  ) {}

  toResponse(data: any) {
    return { message: 'Thành công', data };
  }

  async create(payload: any) {
    const data = this.repo.create(payload);
    await this.em.persistAndFlush(data);
    return data;
  }

  async list(
    query: PaginationQueryDto,
    where?: ObjectQuery<T>,
    options: FindOptions<
      T,
      PopulatePath.ALL,
      PopulatePath.ALL,
      PopulatePath.ALL
    > = {},
  ) {
    const page = query.page;
    const size = query.size;
    const offset = (page - 1) * size;
    where = { deletedAt: null, ...where };
    options = { offset, limit: size, ...options };
    const [data, count] = await this.repo.findAndCount(where, options);
    const last = Math.ceil(count / size);
    const previous = page === 1 ? null : page - 1;
    const next = page >= last ? null : page + 1;
    return { page, size, previous, next, last, count, data };
  }

  async all(
    where?: ObjectQuery<T>,
    options: FindOptions<
      T,
      PopulatePath.ALL,
      PopulatePath.ALL,
      PopulatePath.ALL
    > = {},
  ) {
    where = { deletedAt: null, ...where };
    const data = await this.repo.find(where, options);
    return data;
  }

  async get(
    where?: ObjectQuery<T>,
    options: FindOneOptions<
      T,
      PopulatePath.ALL,
      PopulatePath.ALL,
      PopulatePath.ALL
    > = {},
  ) {
    where = { deletedAt: null, ...where };
    const data = await this.repo.findOne(where, options);
    return data;
  }
}
