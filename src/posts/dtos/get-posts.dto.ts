import { IntersectionType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

class GetPostsBaseDto {
  @IsOptional()
  startDate?: Date;
  @IsOptional()
  endDate?: Date;
}

export class GetPostsDto extends IntersectionType(
  GetPostsBaseDto,
  PaginationQueryDto,
) {}
