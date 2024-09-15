import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  exports: [AuthService],
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
