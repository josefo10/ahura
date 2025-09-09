import { EnumItemDto } from './enum-item.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type, Exclude } from 'class-transformer';

export class CreateCatalogDto {
  @ApiProperty({
    description: 'Identificador único del catálogo',
    example: 'knowledge-types',
  })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Tipos de conocimiento activo',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  activeKnowledgeTypeEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Formatos de archivo',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  formatEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Tipos de conocimiento',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  knowledgeTypeEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Orígenes del activo',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  originEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Niveles de clasificación',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  classificationLevelLevelEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Niveles de criticidad',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  criticalityEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Estados del activo',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  assetStatusEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Estados del comentario',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  commentStatusEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Acciones de auditoría',
    type: [EnumItemDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnumItemDto)
  loggerActionEnum?: EnumItemDto[];

  @ApiProperty({
    description: 'Repositorios disponibles',
    type: EnumItemDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EnumItemDto)
  repositoryEnum?: EnumItemDto;

  @Exclude()
  updatedAt?: any;
}
