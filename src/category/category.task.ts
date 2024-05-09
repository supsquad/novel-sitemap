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
    private readonly em: EntityManager,
    private readonly http: HttpService,
  ) {}

  @Cron('0 0 0 * * *')
  @CreateRequestContext()
  public async getCategories() {
    console.log('get categories: start...');
    const response = await firstValueFrom(
      this.http.get('https://truyenfull.vn'),
    );
    const data = response.data;
    const root = parse(data);
    const elements = root
      .querySelector('.dropdown-menu.multi-column')
      .querySelectorAll('a');
    for (const element of elements) {
      const name = element.text;
      const slug = element.getAttribute('href').split('/').at(-2);
      const category = await this.em.upsert(CategoryEntity, { name, slug });
      this.em.persist(category);
    }
    console.log(`category count: ${elements.length}...`);
    await this.em.flush();
    console.log('get categories: done.');
  }
}
