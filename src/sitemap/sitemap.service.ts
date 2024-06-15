import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import { NovelEntity } from '../entities/novel.entity';
import { SitemapStream, streamToPromise } from 'sitemap';
import { NovelChapterEntity } from '../entities/novelChapter.entity';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class SitemapService implements OnModuleInit {
  constructor(private readonly em: EntityManager) {}

  async onModuleInit() {
    await this.generateSitemap();
  }

  async generateSitemap(): Promise<void> {
    const publicDir = join(process.cwd(), 'public');
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir);
    }
    await this.generateCategorySitemap(publicDir);
    await this.generateNovelSitemap(publicDir);
    await this.generateChapterSitemap(publicDir);
  }

  async generateCategorySitemap(publicDir: string): Promise<void> {
    const categories = await this.em
      .fork()
      .getRepository(CategoryEntity)
      .findAll();
    const sitemap = new SitemapStream({ hostname: 'https://truyencuon.vn' });
    const sitemapPath = join(publicDir, 'category.xml');
    const writeStream = createWriteStream(sitemapPath);
    categories.forEach((category) => {
      sitemap.write({
        url: `/category/${category.slug}`,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
        priority: 0.8,
      });
    });
    sitemap.end();
    await streamToPromise(sitemap).then((data) => writeStream.write(data));
    writeStream.end();
  }

  async generateNovelSitemap(publicDir: string): Promise<void> {
    const novels = await this.em.fork().getRepository(NovelEntity).findAll();
    const sitemap = new SitemapStream({ hostname: 'https://truyencuon.vn' });
    const sitemapPath = join(publicDir, 'novel.xml');
    const writeStream = createWriteStream(sitemapPath);
    novels.forEach((novel) => {
      sitemap.write({
        url: `/novel/${novel.slug}`,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
        priority: 0.8,
      });
    });
    sitemap.end();
    await streamToPromise(sitemap).then((data) => writeStream.write(data));
    writeStream.end();
  }

  async generateChapterSitemap(publicDir: string): Promise<void> {
    const novels = await this.em
      .fork()
      .getRepository(NovelEntity)
      .findAll({ limit: 300 });
    const sitemap = new SitemapStream({ hostname: 'https://truyencuon.vn' });
    const sitemapPath = join(publicDir, 'chapter.xml');
    const writeStream = createWriteStream(sitemapPath);
    for (const novel of novels) {
      const chapters = await this.em
        .fork()
        .getRepository(NovelChapterEntity)
        .find({ novel }, { orderBy: { sequence: 'asc' }, limit: 10 });
      chapters.forEach((chapter) => {
        sitemap.write({
          url: `/${novel.slug}/chapter/${chapter.slug}`,
          changefreq: 'daily',
          lastmod: new Date().toISOString(),
          priority: 0.8,
        });
      });
    }
    sitemap.end();
    await streamToPromise(sitemap).then((data) => writeStream.write(data));
    writeStream.end();
  }
}
