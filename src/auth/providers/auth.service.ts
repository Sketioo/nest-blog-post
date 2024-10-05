import { Injectable } from '@nestjs/common';
import { SigninDto } from '../dtos/sign-in.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(private readonly signInProvider: SignInProvider) {}

  public async signin(signinDto: SigninDto) {
    return await this.signInProvider.signin(signinDto);
  }

  public isAuth() {
    return true;
  }
}
