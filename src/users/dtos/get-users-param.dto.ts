import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetUsersDtoParam {
  @ApiPropertyOptional({
    description: 'Get user with spesific id',
    example: 1234,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id: number;
}
