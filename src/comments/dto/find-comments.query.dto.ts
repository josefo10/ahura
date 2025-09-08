import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

function toArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string')
    return val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export class FindCommentsQueryDto {
  @IsOptional() @IsString() q?: string;

  @IsOptional() @IsString() assetId?: string;
  @IsOptional() @IsString() authorId?: string;
  @IsOptional() @IsString() userName?: string;
  @IsOptional() @IsString() text?: string;
  @IsOptional() @IsString() status?: string;

  @IsOptional() @IsString() createdFrom?: string;
  @IsOptional() @IsString() createdTo?: string;

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  assetIds?: string[];

  @IsOptional()
  @Transform(({ value }) => toArray(value))
  authorIds?: string[];

  @IsOptional() @IsString() sort?: string;
  @IsOptional() @Type(() => Number) @IsInt() page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() limit: number = 20;
}
