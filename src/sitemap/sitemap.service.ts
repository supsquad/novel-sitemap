import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CategoryEntity } from '../entities/category.entity';
import { NovelEntity } from '../entities/novel.entity';
import { SitemapStream, streamToPromise } from 'sitemap';
import { NovelChapterEntity } from '../entities/novelChapter.entity';
import { Readable } from 'stream';

@Injectable()
export class SitemapService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: EntityRepository<CategoryEntity>,
    @InjectRepository(NovelEntity)
    private readonly novelRepository: EntityRepository<NovelEntity>,
    @InjectRepository(NovelChapterEntity)
    private readonly novelChapterRepository: EntityRepository<NovelChapterEntity>,
  ) {}

  async generateCategorySitemap() {
    const categories = await this.categoryRepository.findAll();

    const links = categories.map((category) => ({
      url: `/category/${category.slug}`,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
      priority: 0.8,
    }));

    const stream = new SitemapStream({ hostname: 'https://truyencuon.vn' });

    const xmlString = await streamToPromise(
      Readable.from(links).pipe(stream),
    ).then((data) => data.toString());

    return xmlString;
  }

  async generateNovelSitemap() {
    const novels = await this.novelRepository.findAll();

    const links = novels.map((novel) => ({
      url: `/novel/${novel.slug}`,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
      priority: 0.8,
    }));

    const stream = new SitemapStream({ hostname: 'https://truyencuon.vn' });

    const xmlString = await streamToPromise(
      Readable.from(links).pipe(stream),
    ).then((data) => data.toString());

    return xmlString;
  }

  async generateChapterSitemap() {
    const novels = await this.novelRepository.findAll({ limit: 300 });
    const links = [];

    for (const novel of novels) {
      const chapters = await this.novelChapterRepository.find(
        { novel },
        { orderBy: { sequence: 'asc' }, limit: 10 },
      );

      links.push(
        ...chapters.map((chapter) => ({
          url: `/${novel.slug}/chapter/${chapter.slug}`,
          changefreq: 'daily',
          lastmod: new Date().toISOString(),
          priority: 0.8,
        })),
      );
    }
    const stream = new SitemapStream({ hostname: 'https://truyencuon.vn' });

    const xmlString = await streamToPromise(
      Readable.from(links).pipe(stream),
    ).then((data) => data.toString());

    return xmlString;
  }
}
