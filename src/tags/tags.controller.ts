import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagsDto } from './dtos/create-tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  createTag(@Body() createTagsDto: CreateTagsDto) {
    return this.tagsService.create(createTagsDto);
  }

  @Delete()
  deleteTag(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }
}
