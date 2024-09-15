import { GetUsersDtoParam } from './../dtos/get-users-param.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  public findAll(
    getUsersDtoParam: GetUsersDtoParam,
    limit: number,
    page: number,
  ) {
    return [
      {
        name: 'John Doe',
        email: 'john@mail.com',
      },
      {
        name: 'Jane Doe',
        email: 'jane@mail.com',
      },
    ];
  }

  findOneById(id: number) {
    return {
      id: id,
      name: 'John Doe',
      email: 'john@mail.com',
    };
  }
}
