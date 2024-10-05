import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async findOneByEmail(email: string): Promise<User> {
    let user: User | undefined;
    try {
      user = await this.usersRepository.findOneBy({
        email: email,
      });
    } catch (error) {
      throw new RequestTimeoutException({
        status_code: 408,
        message: 'Cannot process this request, try again later',
        error: error,
      });
    }

    if (!user) {
      throw new NotFoundException({
        status_code: 404,
        message: 'Cannot process this request, try again later',
      });
    }

    return user;
  }
}
