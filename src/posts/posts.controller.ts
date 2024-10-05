import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId?')
  getPosts(@Param('userId') userId: number, @Query() getPostsDto: GetPostsDto) {
    // console.log(getPostsDto);
    return this.postsService.findAll(userId, getPostsDto);
  }

  @ApiOperation({
    summary: 'Create a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post created successfully',
  })
  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @ApiOperation({
    summary: 'Update a post',
  })
  @ApiResponse({
    status: 200,
    description: 'You get a 200 response if your post updated successfully',
  })
  @Patch()
  patchPost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }

  @Delete()
  deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
