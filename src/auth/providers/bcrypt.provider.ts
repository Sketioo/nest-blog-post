import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashingPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    const result = bcrypt.compare(data, encrypted);
    return result;
  }
}
