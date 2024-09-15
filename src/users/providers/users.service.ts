import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersDtoParam } from './../dtos/get-users-param.dto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public findAll(
    getUsersDtoParam: GetUsersDtoParam,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    
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

  findOneByEmail(email: string) {
    return {
      name: 'John DoeLo',
      email: email,
    };
  }
}
