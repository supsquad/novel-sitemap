import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'node-html-parser';
import { LogEntity } from 'src/entities/log.entity';
import { LogType as NovelLogType } from './novel.constants';
import { NovelEntity } from 'src/entities/novel.entity';
import { EntityManager, CreateRequestContext } from '@mikro-orm/postgresql';
import { AuthorEntity } from 'src/entities/author.entity';
import { CategoryEntity } from 'src/entities/category.entity';

@Injectable()
export class NovelTask {
  constructor(
    private readonly em: EntityManager,
    private readonly http: HttpService,
  ) {}

  @Cron('0 */1 * * * *')
  @CreateRequestContext()
  public async getLastNovelPage() {
    console.log('get last novel page: start...');
    const response = await firstValueFrom(
      this.http.get('https://truyenfull.vn/danh-sach/truyen-moi/'),
    );
    const data = response.data;
    const root = parse(data);
    const element = root
      .querySelector('.pagination.pagination-sm')
      .querySelectorAll('a')
      .at(-2);
    const page = parseInt(
      element.getAttribute('href').split('/').at(-2).split('-').at(-1),
    );
    let log = await this.em.findOne(LogEntity, {
      type: NovelLogType.NOVEL_TASK_GET_NOVEL_LAST_PAGE,
    });
    if (log) {
      log.memo = { ...log.memo, last: page };
    } else {
      log = this.em.create(LogEntity, {
        type: NovelLogType.NOVEL_TASK_GET_NOVEL_LAST_PAGE,
        memo: {
          last: page,
          current: 1,
        },
      });
    }
    await this.em.persistAndFlush(log);
    console.log(`last novel page is: ${page}...`);
    console.log('get last novel page: done.');
  }

  @Cron('0 */1 * * * *')
  @CreateRequestContext()
  public async getNovelsByPage() {
    console.log('get novel by page: start...');
    const log = await this.em.findOne(LogEntity, {
      type: NovelLogType.NOVEL_TASK_GET_NOVEL_LAST_PAGE,
    });
    if (log) {
      const pageResponse = await firstValueFrom(
        this.http.get(
          `https://truyenfull.vn/danh-sach/truyen-moi/trang-${log.memo.current}`,
        ),
      );
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
      console.log(`novel count: ${novelElements.length}...`);
      if (log.memo.current >= log.memo.last) {
        log.memo = { ...log.memo, current: 1 };
      } else {
        log.memo = { ...log.memo, current: log.memo.current + 1 };
      }
      this.em.persist(log);
      await this.em.flush();
    }
    console.log('get novel by page: done.');
  }

  @Cron('0 */1 * * * *')
  @CreateRequestContext()
  public async getNovelLastId() {
    console.log('get novel last id: start...');
    const novel = await this.em
      .createQueryBuilder(NovelEntity)
      .orderBy({ id: 'desc' })
      .limit(1)
      .getSingleResult();
    let log = await this.em.findOne(LogEntity, {
      type: NovelLogType.NOVEL_TASK_GET_NOVEL_LAST_ID,
    });
    if (novel) {
      if (log) {
        log.memo = { ...log.memo, last: novel.id };
      } else {
        log = this.em.create(LogEntity, {
          type: NovelLogType.NOVEL_TASK_GET_NOVEL_LAST_ID,
          memo: { last: novel.id, current: 1 },
        });
      }
      this.em.persistAndFlush(log);
      console.log(`last novel id: ${novel.id}`);
    }
    console.log('get novel last id: done.');
  }

  @Cron('0 */1 * * * *')
  @CreateRequestContext()
  public async getNovelChapterLastPage() {
    console.log('get novel chapter last page: start...');
    const getNovelLastIdLog = await this.em.findOne(LogEntity, {
      type: NovelLogType.NOVEL_TASK_GET_NOVEL_LAST_ID,
    });
    if (getNovelLastIdLog) {
      const novel = await this.em.findOne(
        NovelEntity,
        {
          id: getNovelLastIdLog.memo.current,
        },
        { populate: ['authors', 'categories'] },
      );
      if (novel) {
        const response = await firstValueFrom(
          this.http.get(`https://truyenfull.vn/${novel.slug}`),
        );
        const data = response.data;
        const root = parse(data);
        const description = root.querySelector('.desc-text').innerHTML;
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
        let getNovelChapterLastPageLog = await this.em.findOne(LogEntity, {
          type: NovelLogType.NOVEL_TASK_GET_NOVEL_CHAPTER_LAST_PAGE,
          memo: {
            novelId: novel.id,
          },
        });
        if (getNovelChapterLastPageLog) {
          getNovelChapterLastPageLog.memo = {
            ...getNovelChapterLastPageLog.memo,
            last,
          };
        } else {
          getNovelChapterLastPageLog = this.em.create(LogEntity, {
            type: NovelLogType.NOVEL_TASK_GET_NOVEL_CHAPTER_LAST_PAGE,
            memo: {
              novelId: novel.id,
              last,
              current: 1,
            },
          });
        }
        this.em.persist(getNovelChapterLastPageLog);
      }
      if (getNovelLastIdLog.memo.current >= getNovelLastIdLog.memo.last) {
        getNovelLastIdLog.memo = { ...getNovelLastIdLog.memo, current: 1 };
      } else {
        getNovelLastIdLog.memo = {
          ...getNovelLastIdLog.memo,
          current: getNovelLastIdLog.memo.current + 1,
        };
      }
      await this.em.flush();
    }
    console.log('get novel chapter last page: done.');
  }
}
