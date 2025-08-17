import { ApiProperty } from '@nestjs/swagger';

export class CreateLoggerDto {
  @ApiProperty({ description: 'The id of the logger' })
  readonly id: string;

  @ApiProperty({ description: 'The id of the asset' })
  readonly assetId: string;

  @ApiProperty({ description: 'The id of the user' })
  readonly userId: string;

  @ApiProperty({ description: 'The action performed' })
  readonly action: string;

  @ApiProperty({ description: 'The date of the action' })
  readonly date: Date;
}
