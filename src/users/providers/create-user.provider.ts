import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * inject usersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /**
     * inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async create(createUserDto: CreateUserDto) {
    let existingUser = undefined;
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        {
          status_code: 408,
          message: 'Cannot process this request, try again later',
        },
        {
          description: 'Error connecting to database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException({
        status_code: 400,
        message: 'User with that email already exists',
      });
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashingPassword(
        createUserDto.password,
      ),
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
      });
    }

    return user;
  }
}
