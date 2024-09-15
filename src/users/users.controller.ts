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

@Controller('users')
export class UsersController {
  @Get(':id?')
  public getUser(
    @Param() id: GetUsersDtoParam | undefined,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(page);
    console.log(limit);

    return `You sent a get request to user endpoint`;
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    console.log(createUserDto instanceof CreateUserDto);
    console.log('user created!');
    return `You sent a post request to user endpoint`;
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}
