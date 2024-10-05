import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @IsPositive()
  @IsOptional()
  page?: number = 1;
}
