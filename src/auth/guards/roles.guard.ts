import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('entro al rol');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const roles = this.reflector.get(ROLES_KEY, context.getHandler());
    console.log(roles);
    if (!roles) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as PayloadToken;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const isAuth = roles.some((role) => role === user.role);
    if (!isAuth) {
      throw new UnauthorizedException('your role is wrong');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return isAuth;
  }
}
