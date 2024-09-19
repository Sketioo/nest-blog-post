import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/post-type.enum';
import { postStatus } from '../enums/post-status.enum';
import { Type } from 'class-transformer';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'Possible values, "post", "page", "story", "series"',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({ example: 'my-first-post', description: 'The slug' })
  @IsString()
  @MaxLength(512)
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must contain only lowercase letters, numbers, and hyphens. It must start with a letter or number and cannot end with a hyphen.',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: 'Possible values, "draft", "scheduled", "review", "published"',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    example: 'This is my first post',
    description: 'The content of the post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a validation error will be thrown',
    example: '{ "title": "Sample Schema" }',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/featured-img.png',
    description: 'The url of the featured image',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImgUrl?: string;

  @ApiPropertyOptional({ example: '2022-01-01', description: 'Publish on' })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Input the ids of the tags',
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  tags?: number[];

  @ApiPropertyOptional({
    type: 'object',
    required: false,
    items: {
      type: 'object',
      properties: {
        metavalue: {
          type: 'json',
          description: 'The metavalue is JSON string',
          example: '{"sidebarEnabled": true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  @ApiProperty({ type: 'integer', example: '1', description: 'The author id' })
  @IsNotEmpty()
  @IsInt()
  authorId: number;
}
