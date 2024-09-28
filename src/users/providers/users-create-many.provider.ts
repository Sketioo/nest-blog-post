import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  async createMany(createManyUsersDto: CreateManyUsersDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    // Start the transaction
    await this.startTransaction(queryRunner);

    try {
      await this.saveUsers(queryRunner, createManyUsersDto.users);
      await queryRunner.commitTransaction();
      return this.successResponse();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleError(
        'Could not complete the transaction',
        error,
        ConflictException,
      );
    } finally {
      await this.releaseQueryRunner(queryRunner);
    }
  }

  private async startTransaction(queryRunner: QueryRunner) {
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      this.handleError(
        'Cannot process this request, try again later',
        error,
        RequestTimeoutException,
      );
    }
  }

  private async saveUsers(
    queryRunner: QueryRunner,
    users: CreateUserDto[],
  ): Promise<User[]> {
    const newUsers: User[] = [];
    for (const user of users) {
      const newUser = queryRunner.manager.create(User, user);
      const result = await queryRunner.manager.save(newUser);
      newUsers.push(result);
    }
    return newUsers;
  }

  private async releaseQueryRunner(queryRunner: QueryRunner) {
    try {
      await queryRunner.release();
    } catch (error) {
      this.handleError(
        'Could not release the transaction',
        error,
        RequestTimeoutException,
      );
    }
  }

  private handleError(message: string, error: any, ExceptionType: any) {
    console.error(error); // Log internal error
    throw new ExceptionType(message);
  }

  private successResponse() {
    return {
      status_code: 201,
      message: 'Users created successfully',
    };
  }
}
