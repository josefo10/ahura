import { ApiProperty } from '@nestjs/swagger';

export class EnumItemDto {
  @ApiProperty()
  key: string;

  @ApiProperty()
  descripcion?: string;

  @ApiProperty()
  isActive: boolean;
}
