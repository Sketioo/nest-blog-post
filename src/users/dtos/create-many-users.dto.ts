import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyUsersDto {
  @ApiProperty({
    type: [CreateUserDto],
    required: true,
    description: 'The list of users to create',
    items: {
      type: 'user',
    },
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
