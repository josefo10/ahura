import { EnumItemDto } from './enum-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogDto {
  @ApiProperty()
  slug: string;

  @ApiProperty({ type: [EnumItemDto] })
  activeKnowledgeTypeEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  formatEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  knowledgeTypeEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  originEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  classificationLevelLevelEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  criticalityEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  assetStatusEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  commentStatusEnum?: EnumItemDto[];

  @ApiProperty({ type: [EnumItemDto] })
  loggerActionEnum?: EnumItemDto[];
}
