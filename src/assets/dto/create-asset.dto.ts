import { Availability } from '../schemas/asset.schema';
import { ClassificationLevel } from '../schemas/asset.schema';
import { HowIsItStored } from '../schemas/asset.schema';
import { LegalRegulations } from '../schemas/asset.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  @ApiProperty({ description: 'The id of the asset' })
  readonly id: string;

  @ApiProperty({ description: 'The title of the asset' })
  readonly title: string;

  @ApiProperty({ description: 'The publish date of the asset' })
  readonly publishDate: Date;

  @ApiProperty({ description: 'The knowledge type of the asset' })
  readonly knowledgeType: string;

  @ApiProperty({ description: 'The description of the asset' })
  readonly description?: string;

  @ApiProperty({ description: 'The image of the asset' })
  readonly image?: string;

  @ApiProperty({ description: 'The active knowledge type of the asset' })
  readonly activeKnowledgeType?: string;

  @ApiProperty({ description: 'The format of the asset' })
  readonly format?: string;

  @ApiProperty({ description: 'The file URI of the asset' })
  readonly fileUri?: string;

  @ApiProperty({ description: 'The related IDs of the asset' })
  readonly relatedIds?: string[];

  @ApiProperty({ description: 'The keywords of the asset' })
  readonly keywords?: string[];

  @ApiProperty({ description: 'The availability of the asset' })
  readonly availability: Availability;

  @ApiProperty({ description: 'The classification level of the asset' })
  readonly classificationLevel: ClassificationLevel;

  @ApiProperty({ description: 'How the asset is stored' })
  readonly howIsItStored?: HowIsItStored;

  @ApiProperty({ description: 'The legal regulations of the asset' })
  readonly legalRegulations?: LegalRegulations;

  @ApiProperty({ description: 'The owner ID of the asset' })
  readonly ownerId: string;

  @ApiProperty({ description: 'The responsible owner of the asset' })
  readonly responsibleOwner?: string;

  @ApiProperty({ description: 'The confidentiality of the asset' })
  readonly confidentiality?: boolean;

  @ApiProperty({ description: 'The criticality of the asset' })
  readonly criticality?: string;

  @ApiProperty({ description: 'The status of the asset' })
  readonly status?: string;
  origin: string;
}
