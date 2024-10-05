import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/provider/pagination.provider';
import { Paginated } from 'src/common/pagination/interface/paginated.interface';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,
  ) {}
  public findAll(
    userId: number,
    postQuery: GetPostsDto,
  ): Promise<Paginated<Post>> {
    const posts = this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );

    return posts;
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
    let post = undefined;
    let tags = undefined;
    let author = undefined;
    // Find the post

    try {
      post = await this.postsRepository.findOne({
        where: {
          id: patchPostDto.id,
        },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }

    if (!post) {
      throw new BadRequestException({
        status_code: 400,
        message: 'Post not found',
      });
    }

    //Find the tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }

    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException({
        status_code: 400,
        message: 'Tags not found',
      });
    }

    //Find the new author
    try {
      author = await this.usersService.findOne(patchPostDto.authorId);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }

    if (!author) {
      throw new BadRequestException({
        status_code: 400,
        message: 'Author not found',
      });
    }

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
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }
  }

  public async delete(id: number) {
    // Delete the post
    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
