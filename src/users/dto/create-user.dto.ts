import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The id of the post' })
  readonly id: string;
  @ApiProperty({ description: 'The email of the post' })
  readonly email: string;
  @ApiProperty({ description: 'The name of the post' })
  readonly name: string;
  @ApiProperty({ description: 'The role of the post' })
  readonly role: string;
  @ApiProperty({ description: 'The phone of the post' })
  readonly phone?: string;
  @ApiProperty({ description: 'The password of the post' })
  readonly password: string;
}
