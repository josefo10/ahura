import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsUrl,
  IsISO8601,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'Indicates if the asset is accessible' })
  @IsNotEmpty()
  @IsBoolean()
  readonly accessibility: boolean;

  @ApiProperty({ description: 'The location of the asset' })
  @IsNotEmpty()
  @IsString()
  readonly location: string;
}

export class CreateClassificationLevelDto {
  @ApiProperty({ description: 'The classification level of the asset' })
  @IsNotEmpty()
  @IsString()
  readonly level: string;
}

export class CreateHowIsItStoredDto {
  @ApiProperty({ description: 'The knowledge type of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly pecetKnowledge?: string;

  @ApiProperty({ description: 'The centralized repositories of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly centralicedRepositories?: string;
}

export class CreateLegalRegulationsDto {
  @ApiProperty({ description: 'The legal regulations of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly copyright?: string;

  @ApiProperty({ description: 'The patents of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly patents?: string;

  @ApiProperty({ description: 'The trade secrets of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly tradeSecrets?: string;

  @ApiProperty({ description: 'The industrial designs of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly industrialDesigns?: string;

  @ApiProperty({ description: 'The brands of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly brands?: string;

  @ApiProperty({ description: 'The industrial intellectual property of the asset', required: false })
  @IsOptional()
  @IsString()
  readonly industrialIntellectualProperty?: string;
}

export class CreateAssetDto {
  @ApiProperty({ description: 'ID único del activo', example: 'ASSET-001' })
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @ApiProperty({
    description: 'Título del activo',
    example: 'Manual de Procedimientos API',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Fecha de publicación',
    example: '2024-01-15T10:00:00Z',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: false })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value).toISOString();
    }
    return value;
  })
  readonly publishDate: string;

  @ApiProperty({
    description: 'Tipo de conocimiento',
    example: 'Documentación técnica',
  })
  @IsNotEmpty()
  @IsString()
  readonly knowledgeType: string;

  @ApiProperty({
    description: 'Descripción del activo',
    example: 'Manual completo para el uso de la API REST',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'URL de imagen del activo',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  readonly image?: string;

  @ApiProperty({
    description: 'Tipo de conocimiento activo',
    example: 'Procedimiento',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly activeKnowledgeType?: string;

  @ApiProperty({
    description: 'Formato del activo',
    example: 'PDF',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly format?: string;

  @ApiProperty({
    description: 'URI del archivo',
    example: '/uploads/manual.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly fileUri?: string;

  @ApiProperty({
    description: 'IDs de activos relacionados',
    example: ['ASSET-002', 'ASSET-003'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly relatedIds?: string[];

  @ApiProperty({
    description: 'Palabras clave',
    example: ['API', 'REST', 'documentación'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly keywords?: string[];

  @ApiProperty({ description: 'Disponibilidad del activo' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAvailabilityDto)
  readonly availability: CreateAvailabilityDto;

  @ApiProperty({ description: 'Nivel de clasificación del activo' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateClassificationLevelDto)
  readonly classificationLevel: CreateClassificationLevelDto;

  @ApiProperty({ description: 'Cómo se almacena el activo', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateHowIsItStoredDto)
  readonly howIsItStored?: CreateHowIsItStoredDto;

  @ApiProperty({
    description: 'Regulaciones legales del activo',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateLegalRegulationsDto)
  readonly legalRegulations?: CreateLegalRegulationsDto;

  @ApiProperty({ description: 'ID del propietario', example: 'USER-123' })
  @IsNotEmpty()
  @IsString()
  readonly ownerId: string;

  @ApiProperty({
    description: 'Propietario responsable',
    example: 'Juan Pérez',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly responsibleOwner?: string;

  @ApiProperty({
    description: 'Confidencialidad del activo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly confidentiality?: boolean;

  @ApiProperty({
    description: 'Criticidad del activo',
    example: 'Alta',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly criticality?: string;

  @ApiProperty({
    description: 'Estado del activo',
    example: 'Activo',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly status?: string;

  @ApiProperty({ description: 'Origen del activo', example: 'Interno' })
  @IsNotEmpty()
  @IsString()
  readonly origin: string;

  @ApiProperty({ description: 'Contador de vistas', example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  readonly viewCount: number;

  @ApiProperty({ description: 'Contador de descargas', example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  readonly downloadCount: number;

  @ApiProperty({
    description: 'Contador de comentarios',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  readonly commentCount: number;
}
