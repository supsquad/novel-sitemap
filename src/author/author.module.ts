import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import config from '../core/axios.config';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthorEntity } from 'src/entities/author.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    HttpModule.register(config),
    MikroOrmModule.forFeature([AuthorEntity]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
