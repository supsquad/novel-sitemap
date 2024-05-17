import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'node-html-parser';
import { NovelTaskName } from './novel.constants';
import { NovelEntity } from 'src/entities/novel.entity';
import { EntityManager, CreateRequestContext } from '@mikro-orm/postgresql';
import { AuthorEntity } from 'src/entities/author.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskScope } from 'src/app.constants';
import { NovelChapterEntity } from 'src/entities/novelChapter.entity';

@Injectable()
export class NovelTask {
  constructor(
    readonly em: EntityManager,
    readonly http: HttpService,
  ) {}

  @Cron('0 */5 * * * *')
  @CreateRequestContext()
  async getLastNovelPage() {
    const response = await firstValueFrom(
      this.http.get('https://truyenfull.vn/danh-sach/truyen-moi/'),
    );
    if (response.status !== 200) {
      console.log('cannot get last novel page.');
      return;
    }
    const data = response.data;
    const root = parse(data);
    const last = parseInt(
      root
        .querySelector('.pagination.pagination-sm')
        .querySelectorAll('a')
        .at(-2)
        .getAttribute('href')
        .split('/')
        .at(-2)
        .split('-')
        .at(-1),
    );
    let task = await this.em.findOne(
      TaskEntity,
      {
        scope: TaskScope.NOVEL,
        name: NovelTaskName.GET_LAST_NOVEL_PAGE,
      },
      { orderBy: { priority: 'asc' } },
    );
    if (task) {
      task.last = last;
    } else {
      task = this.em.create(TaskEntity, {
        scope: TaskScope.NOVEL,
        name: NovelTaskName.GET_LAST_NOVEL_PAGE,
        current: 1,
        last,
      });
    }
    await this.em.persistAndFlush(task);
    console.log(`last novel page is ${last}.`);
  }

  @Cron('0 */5 * * * *')
  @CreateRequestContext()
  async getNovelsByPage() {
    const task = await this.em.findOne(
      TaskEntity,
      {
        scope: TaskScope.NOVEL,
        name: NovelTaskName.GET_LAST_NOVEL_PAGE,
      },
      { orderBy: { priority: 'asc' } },
    );
    if (task) {
      const pageResponse = await firstValueFrom(
        this.http.get(
          `https://truyenfull.vn/danh-sach/truyen-moi/trang-${task.current}`,
        ),
      );
      if (pageResponse.status !== 200) {
        console.log('cannot get novels by page.');
        return;
      }
      const data = pageResponse.data;
      const root = parse(data);
      const novelElements = root
        .querySelector('.list.list-truyen.col-xs-12')
        .querySelectorAll('.row');
      for (const novelElement of novelElements) {
        const nameElement = novelElement
          .querySelector('.col-xs-7')
          .querySelector('a');
        const name = nameElement.text;
        const slug = nameElement.getAttribute('href').split('/').at(-2);
        const chapterCount =
          parseInt(
            novelElement
              .querySelector('.col-xs-2.text-info')
              .querySelector('a')
              .text.split(' ')
              .at(-1),
          ) || 0;
        const tags = [];
        const tagElements = novelElement.querySelectorAll('.label-title');
        for (const tagElement of tagElements) {
          const tagElementClasses = tagElement.getAttribute('class').split(' ');
          if (tagElementClasses.length === 2) {
            tags.push(tagElementClasses.at(1).split('-').at(-1));
          }
        }
        const novel = await this.em.upsert(NovelEntity, {
          name,
          slug,
          chapterCount,
          tags,
        });
        this.em.persist(novel);
      }
      if (task.current >= task.last) {
        task.current = 1;
        task.priority = task.priority + 1;
      } else {
        task.current = task.current + 1;
      }
      await this.em.flush();
      console.log(`novel count is ${novelElements.length}.`);
    }
  }

  @Cron('0 */1 * * * *')
  @CreateRequestContext()
  async getNovel() {
    const novel = await this.em.findOne(
      NovelEntity,
      {
        authors: null,
        categories: null,
        description: null,
      },
      { populate: ['authors', 'categories'] },
    );
    if (novel) {
      const response = await firstValueFrom(
        this.http.get(`https://truyenfull.vn/${novel.slug}`),
      );
      if (response.status !== 200) {
        console.log('cannot get novel page.');
        return;
      }
      const data = response.data;
      const root = parse(data);
      const description = root.querySelector('.desc-text').text;
      const score = parseFloat(
        root.querySelector('[itemprop=ratingValue]')?.text || '10',
      );
      const authorElement = root.querySelector('[itemprop=author]');
      if (authorElement) {
        const authorSlug = authorElement.getAttribute('href').split('/').at(-2);
        const authorName = authorElement.text;
        const author = await this.em.upsert(AuthorEntity, {
          slug: authorSlug,
          name: authorName,
        });
        this.em.persist(author);
        if (!novel.authors.contains(author)) {
          novel.authors.add(author);
        }
      }
      const categories = [];
      const categoryElements = root
        .querySelector('.info')
        .querySelectorAll('[itemprop=genre]');
      for (const categoryElement of categoryElements) {
        const categorySlug = categoryElement
          .getAttribute('href')
          .split('/')
          .at(-2);
        const categoryName = categoryElement.text;
        const category = await this.em.upsert(CategoryEntity, {
          slug: categorySlug,
          name: categoryName,
        });
        this.em.persist(category);
        categories.push(category);
      }
      novel.description = description;
      novel.score = score;
      if (novel.categories === null) {
        novel.categories = [];
      }
      for (const category of categories) {
        if (!novel.categories.includes(category.slug)) {
          novel.categories.push(category.slug);
        }
      }
      const pagination = root.querySelector('.pagination.pagination-sm');
      const last = pagination
        ? parseInt(
            pagination
              .querySelectorAll('li')
              .at(-2)
              .querySelector('a')
              .getAttribute('href')
              .split('/')
              .at(-2)
              .split('-')
              .at(-1),
          )
        : 1;
      const task = this.em.create(TaskEntity, {
        scope: TaskScope.NOVEL,
        name: NovelTaskName.GET_LAST_NOVEL_CHAPTER_PAGE,
        current: 1,
        last,
        novel,
      });
      this.em.persist(task);
      await this.em.flush();
      console.log(`get novel id: ${novel.id}`);
    }
  }

  @Cron('*/15 * * * * *')
  @CreateRequestContext()
  async getNovelChapters() {
    const task = await this.em.findOne(
      TaskEntity,
      {
        scope: TaskScope.NOVEL,
        name: NovelTaskName.GET_LAST_NOVEL_CHAPTER_PAGE,
      },
      { orderBy: { priority: 'asc' }, populate: ['novel'] },
    );
    if (task) {
      const response = await firstValueFrom(
        this.http.get(
          `https://truyenfull.vn/${task.novel.slug}/trang-${task.current}`,
        ),
      );
      if (response.status !== 200) {
        console.log('cannot get novel chapters.');
        return;
      }
      const data = response.data;
      const root = parse(data);
      const chapterElements = root
        .querySelectorAll('.list-chapter')
        .flatMap((element) => element.querySelectorAll('a'));
      for (let i = 0; i < chapterElements.length; i++) {
        const slug = chapterElements[i].getAttribute('href').split('/').at(-2);
        const name = chapterElements[i].text;
        const sequence = i + (task.current - 1) * 50 + 1;
        const novelChapter = await this.em.upsert(NovelChapterEntity, {
          slug,
          name,
          sequence,
          novel: task.novel,
        });
        this.em.persist(novelChapter);
      }
      if (task.current >= task.last) {
        task.current = 1;
        task.priority = task.priority + 1;
      } else {
        task.current = task.current + 1;
      }
      this.em.flush();
      console.log(
        `get chapters from ${(task.current - 1) * 50 + 1} to ${chapterElements.length + (task.current - 1) * 50 + 1} of novel ${task.novel.id}`,
      );
    }
  }

  @Cron('*/15 * * * * *')
  @CreateRequestContext()
  async getNovelChaperContent() {
    const novelChapter = await this.em.findOne(
      NovelChapterEntity,
      {
        content: null,
      },
      { populate: ['novel'] },
    );
    if (novelChapter) {
      const response = await firstValueFrom(
        this.http.get(
          `https://truyenfull.vn/${novelChapter.novel.slug}/${novelChapter.slug}`,
        ),
      );
      if (response.status !== 200) {
        console.log('cannot get novel chapter content.');
        return;
      }
      const data = response.data;
      const root = parse(data);
      const content = root.querySelector('.chapter-c').text;
      novelChapter.content = content;
      await this.em.flush();
      console.log(`get content of chapter ${novelChapter.id}.`);
    }
  }
}
