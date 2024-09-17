import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './providers/posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { MetaOptionsModule } from 'src/meta-options/meta-options.module';

@Module({
  exports: [PostsService],
  imports: [TypeOrmModule.forFeature([Post, MetaOption]), MetaOptionsModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
