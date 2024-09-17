import { CreatePostMetaOptionsDto } from 'src/meta-options/dtos/create-post-meta-options.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  createMetaOption(@Body() createPostMetaOptionDto: CreatePostMetaOptionsDto) {
    return this.metaOptionsService.create(createPostMetaOptionDto);
  }
}
