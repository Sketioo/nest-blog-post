import { Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

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
  ) {}
  public findAll() {
    return this.postsRepository.find();
  }

  public async create(@Body() createPostDto: CreatePostDto) {
    // Create the post
    const post = this.postsRepository.create(createPostDto);

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    // Find a post
    const post = await this.postsRepository.findOneBy({ id });
    // Delete the post
    await this.postsRepository.delete(id);
    // Delete the metaoptions
    await this.metaOptionsRepository.delete(post.metaOptions.id);
    // Return confirmation
    return { deleted: true, id: post.id };
  }
}
