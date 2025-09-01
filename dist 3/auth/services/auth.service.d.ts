import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/user.service';
import { User } from 'src/users/schema/user.schema';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        [x: string]: any;
    } | null>;
    generateJWT(user: User): {
        access_token: string;
        user: User;
    };
}
