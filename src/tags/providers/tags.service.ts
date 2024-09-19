import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagsDto } from '../dtos/create-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagsDto: CreateTagsDto): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagsDto);
    return this.tagsRepository.save(tag);
  }

  async findMultipleTags(id: number[]): Promise<Tag[]> {
    const tags = await this.tagsRepository.find({
      where: {
        id: In(id),
      },
    });
    return tags;
  }

  async delete(id: number) {
    await this.tagsRepository.delete(id);
    return {
      id,
      message: 'Deleted successfully',
    };
  }
}
