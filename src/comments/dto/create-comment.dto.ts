import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The id of the comment' })
  readonly id: string;

  @ApiProperty({ description: 'The id of the asset' })
  readonly assetId: string;

  @ApiProperty({ description: 'The id of the author' })
  readonly authorId: string;

  @ApiProperty({ description: 'The text of the comment' })
  readonly text: string;

  @ApiProperty({ description: 'The status of the comment' })
  readonly status: string;

  @ApiProperty({ description: 'The creation date of the comment' })
  readonly createdAt: Date;
}
