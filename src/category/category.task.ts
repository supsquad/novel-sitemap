import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'node-html-parser';
import { CategoryEntity } from 'src/entities/category.entity';
import { EntityManager, CreateRequestContext } from '@mikro-orm/postgresql';

@Injectable()
export class CategoryTask {
  constructor(
    readonly em: EntityManager,
    readonly http: HttpService,
  ) {}

  @Cron('0 */5 * * * *')
  @CreateRequestContext()
  async getCategories() {
    const response = await firstValueFrom(
      this.http.get('https://truyenfull.vn'),
    );
    if (response.status !== 200) {
      console.log('cannot get categories page.');
      return;
    }
    const data = response.data;
    const root = parse(data);
    const elements = root
      .querySelector('.dropdown-menu.multi-column')
      ?.querySelectorAll('a');
    if (elements === undefined || elements.length === 0) {
      console.log('categories not found.');
      return;
    }
    for (const element of elements) {
      const name = element.text;
      const slug = element.getAttribute('href').split('/').at(-2);
      const category = await this.em.upsert(CategoryEntity, { name, slug });
      this.em.persist(category);
    }
    await this.em.flush();
    console.log(`category count ${elements.length}.`);
  }
}
