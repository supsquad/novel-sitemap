import { Cron } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'node-html-parser';
import { EntityManager, CreateRequestContext } from '@mikro-orm/core';
import { LogEntity } from 'src/entities/log.entity';
import { LogType as NovelLogType } from './novel.constants';
import { NovelEntity } from 'src/entities/novel.entity';

@Injectable()
export class NovelTask {
  constructor(
    private readonly em: EntityManager,
    private readonly http: HttpService,
  ) {}

  @Cron('0 */1 * * * *')
  @CreateRequestContext()
  public async getLastPage() {
    console.log('get last page: start...');
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
      type: NovelLogType.NOVEL_TASK,
    });
    if (log) {
      log.memo = { ...log.memo, last: page };
    } else {
      log = this.em.create(LogEntity, {
        type: NovelLogType.NOVEL_TASK,
        memo: {
          last: page,
          current: 1,
        },
      });
    }
    this.em.persistAndFlush(log);
    console.log(`last page is: ${page}...`);
    console.log('get last page: done.');
  }

  @Cron('0 */1 * * * *')
  @CreateRequestContext()
  public async getNovelsByPage() {
    console.log('get novel by page: start...');
    const log = await this.em.findOne(LogEntity, {
      type: NovelLogType.NOVEL_TASK,
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
      novelElements.forEach(async (novelElement) => {
        const nameElement = novelElement
          .querySelector('.col-xs-7')
          .querySelector('a');
        const name = nameElement.text;
        const slug = nameElement.getAttribute('href').split('/').at(-2);
        const chapterCount = parseInt(
          novelElement
            .querySelector('.col-xs-2.text-info')
            .querySelector('a')
            .text.split(' ')
            .at(-1),
        );
        const tags = [];
        const tagElements = novelElement.querySelectorAll('.label-title');
        tagElements.forEach((tagElement) => {
          const tagElementClasses = tagElement.getAttribute('class').split(' ');
          if (tagElementClasses.length === 2) {
            tags.push(tagElementClasses.at(1).split('-').at(-1));
          }
        });
        const novel = await this.em.upsert(NovelEntity, {
          name,
          slug,
          chapterCount,
          tags,
        });
        this.em.persist(novel);
      });
      console.log(`novel count: ${novelElements.length}...`);
      if (log.memo.current === log.memo.last) {
        log.memo = { ...log.memo, current: 1 };
      } else {
        log.memo = { ...log.memo, current: log.memo.current + 1 };
      }
      this.em.persist(log);
      await this.em.flush();
    }
    console.log('get novel by page: done.');
  }
}
