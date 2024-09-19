import { Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Inject metaOptionsRepository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,

    private readonly usersService: UsersService,
  ) {}
  public findAll() {
    return this.postsRepository.find({
      relations: {
        author: true,
        metaOptions: true,
      },
    });
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    // Find author id
    const author = await this.usersService.findOne(createPostDto.authorId);
    // Create the post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
    });

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    // Delete the post
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
