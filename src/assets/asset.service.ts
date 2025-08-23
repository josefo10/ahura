import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset, AssetDocument } from './schemas/asset.schema';
import { CatalogService } from 'src/catalogs/catalog.service';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    private readonly catalogs: CatalogService,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    try {
      // 1) valida enums con catálogo
      await this.catalogs.validateAssetEnums(createAssetDto);

      // 2) normaliza opcionales para evitar undefined vs string
      const payload: Partial<Asset> = {
        ...createAssetDto,
        description: createAssetDto.description ?? '',
        image: createAssetDto.image ?? '',
        activeKnowledgeType: createAssetDto.activeKnowledgeType ?? '',
        format: createAssetDto.format ?? '',
        fileUri: createAssetDto.fileUri ?? '',
        relatedIds: createAssetDto.relatedIds ?? [],
        keywords: createAssetDto.keywords ?? [],
        responsibleOwner: createAssetDto.responsibleOwner ?? '',
        confidentiality: createAssetDto.confidentiality ?? false,
        criticality: createAssetDto.criticality ?? 'leve',
        status: createAssetDto.status ?? 'en curso',
        origin: createAssetDto.origin ?? 'interno',
      };

      const created = new this.assetModel(payload);
      return await created.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(error?.message ?? 'Error creating asset');
    }
  }

  async update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    try {
      // valida solo lo que venga
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.catalogs.validateAssetEnums(updateAssetDto as any);

      const updated = await this.assetModel
        .findOneAndUpdate({ id }, updateAssetDto, { new: true })
        .exec();
      if (!updated)
        throw new NotFoundException(`Asset with id ${id} not found`);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating asset');
    }
  }

  async findAll(): Promise<Asset[]> {
    try {
      return await this.assetModel.find().exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching assets');
    }
  }

  async findOne(id: string): Promise<Asset> {
    try {
      const asset = await this.assetModel.findOne({ id }).exec();
      if (!asset) throw new NotFoundException(`Asset with id ${id} not found`);
      return asset;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching asset');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.assetModel.findOneAndDelete({ id }).exec();
      if (!result) throw new NotFoundException(`Asset with id ${id} not found`);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting asset');
    }
  }
}
