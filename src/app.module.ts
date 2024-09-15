import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/providers/users.service';
import { PostsModule } from './posts/posts.module';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/providers/posts.service';

@Module({
  imports: [UsersModule, PostsModule],
  controllers: [AppController, PostsController],
  providers: [AppService, UsersService, PostsService],
})
export class AppModule {}
