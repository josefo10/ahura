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
  // Búsqueda global (sobre title, description, keywords)
  @IsOptional() @IsString() q?: string;

  // Campos base
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

  // Rango de fechas
  @IsOptional() @IsString() publishFrom?: string; // ISO
  @IsOptional() @IsString() publishTo?: string;

  // Arrays
  @IsOptional() @Transform(({ value }) => toArray(value)) keywords?: string[];
  @IsOptional() @Transform(({ value }) => toArray(value)) ids?: string[]; // Mongo _id (opcional)
  @IsOptional()
  @Transform(({ value }) => toArray(value))
  businessIds?: string[]; // campo 'id' de negocio

  // Booleanos
  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  confidentiality?: boolean;

  // --------- SUBNIVELES (MÍNIMO CAMBIO) ----------

  // availability.*
  @IsOptional()
  @Transform(({ value }) => toBool(value))
  @IsBoolean()
  availabilityAccessibility?: boolean;

  @IsOptional()
  @IsString()
  availabilityLocation?: string; // regex i

  // classificationLevel.level
  @IsOptional()
  @IsString()
  classificationLevelLevel?: string;

  // howIsItStored.*
  @IsOptional()
  @IsString()
  howPecetKnowledge?: string; // regex i

  @IsOptional()
  @IsString()
  howCentralicedRepositories?: string; // regex i

  // legalRegulations.* (cada subcampo)
  @IsOptional() @IsString() legalCopyright?: string; // regex i
  @IsOptional() @IsString() legalPatents?: string; // regex i
  @IsOptional() @IsString() legalTradeSecrets?: string; // regex i
  @IsOptional() @IsString() legalIndustrialDesigns?: string; // regex i
  @IsOptional() @IsString() legalBrands?: string; // regex i
  @IsOptional() @IsString() legalIndustrialIntellectualProperty?: string; // regex i

  // Atajo: buscar en TODOS los subcampos legales
  @IsOptional() @IsString() legalAny?: string;

  // Paginación / orden
  @IsOptional() @IsString() sort?: string; // "-publishDate,title"
  @IsOptional() @Type(() => Number) @IsInt() page: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() limit: number = 20;
}
