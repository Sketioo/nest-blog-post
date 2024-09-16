import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  public findAll(userId: number) {
    console.log(userId);
  }

  public create(body: CreatePostDto) {
    console.log(body);
  }
}
