export class CreateUserDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
  readonly phone?: string;
  readonly password: string;
}
