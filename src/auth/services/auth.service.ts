import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string) {
    console.log('valida?');

    const user = await this.userService.findByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { password, ...rta } = user.toJSON();
        return rta;
      }
    }
    return null;
  }
}
