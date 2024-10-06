import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SigninDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,

    /**
     * inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTTL,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      },
    );
    // Return the data or issued a access token
    return {
      message: 'Signin Success!',
      access_token: accessToken,
    };
  }
}
