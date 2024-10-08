import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { AuthService } from 'src/auth/providers/auth.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PatchUserDto } from '../dtos/patch-user.dto';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateUserProvider } from './create-user.provider';

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

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserProvider: FindOneUserByEmailProvider,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    return this.createUserProvider.create(createUserDto);
  }

  /**
   * Fetched a list of registered users on the application
   *
   * @param getUsersDtoParam The query param for getting users
   * @param limit The numbers of entries returned per query
   * @param page The page number
   * @returns The list of users
   */
  public findAll() {
    let findUsers = undefined;

    try {
      findUsers = this.usersRepository.find();
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }

    if (findUsers.length === 0) {
      throw new BadRequestException({
        status_code: 400,
        message: 'No users found',
      });
    }

    return findUsers;
  }

  /**
   * Fetched a user by id
   *
   * @param id The user id
   * @returns The user
   */
  findOne(id: number): Promise<User> {
    let user = undefined;
    try {
      user = this.usersRepository.findOneBy({ id: id });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }

    if (!user) {
      throw new BadRequestException({
        status_code: 400,
        message: 'User not found',
      });
    }
    return user;
  }

  /**
   * Fetched a user by email
   *
   * @param email The user email
   * @returns The user
   */

  async update(id: number, patchUserDto: PatchUserDto) {
    let updateUser = undefined;

    try {
      updateUser = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }

    if (!updateUser) {
      throw new BadRequestException({
        status_code: 400,
        message: 'User not found',
      });
    }

    let merge = undefined;
    try {
      merge = this.usersRepository.merge(updateUser, patchUserDto);
      await this.usersRepository.save(merge);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }
    return merge;
  }

  async createMany(createManyUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.findOneUserProvider.findOneByEmail(email);
  }
}
