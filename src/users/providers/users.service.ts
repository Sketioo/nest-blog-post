import { AuthService } from 'src/auth/providers/auth.service';
import { GetUsersDtoParam } from './../dtos/get-users-param.dto';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

/**
 * Class to connect to Users table and performs business operation
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for UsersService
   *
   * @param authService The AuthService that is used to inject the AuthService
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  /**
   * Fetched a list of registered users on the application
   *
   * @param getUsersDtoParam The query param for getting users
   * @param limit The numbers of entries returned per query
   * @param page The page number
   * @returns The list of users
   */
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

  /**
   * Fetched a user by id
   *
   * @param id The user id
   * @returns The user
   */
  findOneById(id: number) {
    return {
      id: id,
      name: 'John Doe',
      email: 'john@mail.com',
    };
  }

  /**
   * Fetched a user by email
   *
   * @param email The user email
   * @returns The user
   */
  findOneByEmail(email: string) {
    return {
      name: 'John DoeLo',
      email: email,
    };
  }
}
