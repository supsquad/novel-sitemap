import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CategoryTask } from './category.task';

@Module({
  imports: [
    HttpModule.register({
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 8_8_9) AppleWebKit/601.1 (KHTML, like Gecko) Chrome/51.0.2023.271 Safari/600',
      },
    }),
  ],
  providers: [CategoryTask],
})
export class CategoryModule {}
