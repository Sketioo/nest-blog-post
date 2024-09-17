import { AuthService } from 'src/auth/providers/auth.service';
import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

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
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);
  }

  /**
   * Fetched a list of registered users on the application
   *
   * @param getUsersDtoParam The query param for getting users
   * @param limit The numbers of entries returned per query
   * @param page The page number
   * @returns The list of users
   */
  public findAll() {}

  /**
   * Fetched a user by id
   *
   * @param id The user id
   * @returns The user
   */
  findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
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
