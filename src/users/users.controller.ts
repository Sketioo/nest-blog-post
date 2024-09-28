import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersDtoParam } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id?')
  @ApiOperation({
    summary: 'Fetched a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'The numbers of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'The page number',
    example: 1,
  })
  public getUsers(
    @Param() getUsersDtoParam: GetUsersDtoParam | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll();
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch(':id')
  public patchUser(
    @Param() getUsersDtoParam: GetUsersDtoParam,
    @Body() patchUserDto: PatchUserDto,
  ) {
    return this.usersService.update(getUsersDtoParam.id, patchUserDto);
  }
}
