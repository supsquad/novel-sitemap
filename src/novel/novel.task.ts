import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'node-html-parser';
import { NovelTaskName } from './novel.constants';
import { NovelEntity } from 'src/entities/novel.entity';
import {
  EntityManager,
  CreateRequestContext,
  raw,
} from '@mikro-orm/postgresql';
import { AuthorEntity } from 'src/entities/author.entity';
import { CategoryEntity } from 'src/entities/category.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskScope } from 'src/app.constants';
import { NovelChapterEntity } from 'src/entities/novelChapter.entity';

@Injectable()
export class NovelTask {
  constructor(
    private readonly em: EntityManager,
    private readonly http: HttpService,
  ) {}

  @Cron('0 */5 * * * *')
  @CreateRequestContext()
  public async getLastNovelPage() {
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
    let task = await this.em.findOne(TaskEntity, {
      scope: TaskScope.NOVEL,
      name: NovelTaskName.GET_LAST_NOVEL_PAGE,
    });
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
  public async getNovelsByPage() {
    const getLastNovelPageTask = await this.em.findOne(TaskEntity, {
      scope: TaskScope.NOVEL,
      name: NovelTaskName.GET_LAST_NOVEL_PAGE,
    });
    if (getLastNovelPageTask) {
      const pageResponse = await firstValueFrom(
        this.http.get(
          `https://truyenfull.vn/danh-sach/truyen-moi/trang-${getLastNovelPageTask.current}`,
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
        const getNovelChaperTask = await this.em.upsert(TaskEntity, {
          scope: TaskScope.NOVEL,
          name: NovelTaskName.GET_NOVEL_CHAPTER,
          novel,
          last: chapterCount,
        });
        this.em.persist(getNovelChaperTask);
        this.em.persist(novel);
      }
      if (getLastNovelPageTask.current >= getLastNovelPageTask.last) {
        getLastNovelPageTask.current = 1;
      } else {
        getLastNovelPageTask.current = getLastNovelPageTask.current + 1;
      }
      await this.em.flush();
      console.log(`novel count is ${novelElements.length}.`);
    }
  }

  @Cron('* */1 * * * *')
  @CreateRequestContext()
  public async getNovel() {
    const novel = await this.em.findOne(
      NovelEntity,
      {
        authors: null,
        categories: null,
        description: null,
        score: null,
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
      const authorSlug = authorElement.getAttribute('href').split('/').at(-2);
      const authorName = authorElement.text;
      const author = await this.em.upsert(AuthorEntity, {
        slug: authorSlug,
        name: authorName,
      });
      this.em.persist(author);
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
      if (!novel.authors.contains(author)) {
        novel.authors.add(author);
      }
      for (const category of categories) {
        if (!novel.categories.contains(category)) {
          novel.categories.add(category);
        }
      }
      await this.em.flush();
    }
  }

  @Cron('*/15 * * * * *')
  @CreateRequestContext()
  public async getNovelChaper() {
    const task = await this.em.findOne(
      TaskEntity,
      {
        scope: TaskScope.NOVEL,
        name: NovelTaskName.GET_NOVEL_CHAPTER,
        $or: [{ current: null }, { [raw('current')]: { $lt: raw('last') } }],
        last: { $ne: null },
      },
      { populate: ['novel'] },
    );
    if (task) {
      if (task.current === null) {
        task.current = 1;
      }
      const response = await firstValueFrom(
        this.http.get(
          `https://truyenfull.vn/${task.novel.slug}/chuong-${task.current}`,
        ),
      );
      if (response.status !== 200) {
        console.log('cannot get novel chapter.');
        return;
      }
      const data = response.data;
      const root = parse(data);
      const name = root.querySelector('.chapter-title').text;
      const content = root.querySelector('.chapter-c').text;
      const novelChapter = this.em.create(NovelChapterEntity, {
        name,
        content,
        novel: task.novel,
        sequence: task.current,
      });
      this.em.persist(novelChapter);
      task.current = task.current + 1;
      await this.em.flush();
      console.log(
        `get chapter ${novelChapter.sequence}/${task.last} of novel ${task.novel.id}.`,
      );
    }
  }
}
