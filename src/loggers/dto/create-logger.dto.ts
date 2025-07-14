export class CreateLoggerDto {
  readonly id: string;
  readonly assetId: string;
  readonly userId: string;
  readonly action: string;
  readonly date: Date;
}
