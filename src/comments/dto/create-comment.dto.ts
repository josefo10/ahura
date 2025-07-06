export class CreateCommentDto {
  readonly id: string;
  readonly assetId: string;
  readonly authorId: string;
  readonly text: string;
  readonly status: string;
  readonly createdAt: Date;
}
