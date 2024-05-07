import { Interval } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'node-html-parser';
import { EntityManager, CreateRequestContext } from '@mikro-orm/core';
import { CategoryEntity } from 'src/entities/category.entity';

@Injectable()
export class CategoryTask {
  constructor(
    private readonly em: EntityManager,
    private readonly http: HttpService,
  ) {}

  @Interval(24 * 60 * 60 * 1000)
  @CreateRequestContext()
  public async getCategories() {
    console.log('Get categories task: start...');
    const response = await firstValueFrom(
      this.http.get('https://truyenfull.vn'),
    );
    const data = response.data;
    const root = parse(data);
    const elements = root
      .querySelector('.dropdown-menu.multi-column')
      .querySelectorAll('a');
    elements.forEach(async (element) => {
      const href = element.getAttribute('href');
      const originalId = href.split('/').at(-2);
      const payload = {
        name: element.text,
        slug: originalId,
        originalId,
      };
      if (await this.em.findOne(CategoryEntity, { originalId })) {
        return;
      }
      const category = this.em.create(CategoryEntity, payload);
      this.em.persist(category);
    });
    await this.em.flush();
    console.log('Get categories task: done.');
  }
}
