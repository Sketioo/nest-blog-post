import { Body, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

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
    private readonly tagsService: TagsService,
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
    // FInd the tags based on the ids
    const tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    // Create the post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  async update(patchPostDto: PatchPostDto): Promise<Post> {
    // Find the post
    const post = await this.postsRepository.findOne({
      where: {
        id: patchPostDto.id,
      },
    });
    //FInd the tags
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    //Find the new author
    const author = await this.usersService.findOne(patchPostDto.authorId);
    // Change the post property
    post.title = patchPostDto.title ?? post.title;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.status = patchPostDto.status ?? post.status;
    post.content = patchPostDto.content ?? post.content;
    post.schema = patchPostDto.schema ?? post.schema;
    post.featuredImgUrl = patchPostDto.featuredImgUrl ?? post.featuredImgUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.author = author;
    post.tags = tags;
    // Save the changes
    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    // Delete the post
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
