import { IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

function toArray(val: any): string[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  if (Array.isArray(val)) return val;
  if (typeof val === 'string')
    return val
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}
function toBool(v: any) {
  const s = String(v).toLowerCase();
  return ['true', '1', 'yes', 'y'].includes(s)
    ? true
    : ['false', '0', 'no', 'n'].includes(s)
      ? false
      : undefined;
}

export class FindAssetsQueryDto {
  @IsOptional() @IsString() q?: string; // búsqueda global (title, description, keywords)
  @IsOptional() @IsString() title?: string; // regex i
  @IsOptional() @IsString() description?: string; // regex i
  @IsOptional() @IsString() knowledgeType?: string; // exact
  @IsOptional() @IsString() activeKnowledgeType?: string;
  @IsOptional() @IsString() format?: string;
  @IsOptional() @IsString() status?: string; // ej: 'en curso'
  @IsOptional() @IsString() criticality?: string; // ej: 'leve'
  @IsOptional() @IsString() origin?: string; // ej: 'interno'
  @IsOptional() @IsString() ownerId?: string;
  @IsOptional() @IsString() responsibleOwner?: string; // regex i

  @IsOptional() @IsString() publishFrom?: string; // ISO date
  @IsOptional() @IsString() publishTo?: string;

  @IsOptional() @Transform(({ value }) => toArray(value)) keywords?: string[]; // lista CSV
  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  confidentiality?: boolean;

  // ids=aaa,bbb (Mongo _id opcional si lo usan), o id de negocio (campo 'id')
  @IsOptional() @Transform(({ value }) => toArray(value)) ids?: string[];
  @IsOptional()
  @Transform(({ value }) => toArray(value))
  businessIds?: string[];

  @IsOptional() @IsString() sort?: string; // "-publishDate,title"
  @IsOptional() @Type(() => Number) @IsInt() page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() limit: number = 20;
}
