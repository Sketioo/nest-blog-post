import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SigninDto } from '../dtos/sign-in.dto';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,
  ) {}

  async signin(signinDto: SigninDto) {
    const user = await this.usersService.findOneByEmail(signinDto.email);
    // Compare the credentials
    const compareResult = await this.hashingProvider.comparePassword(
      signinDto.password,
      user.password,
    );
    // If false return a response message
    if (!compareResult) {
      throw new UnauthorizedException({
        message: 'Credentials is not valid!',
      });
    }
    // Return the data or issued a access token
    return {
      message: 'Signin Success!',
    };
  }
}
