import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset, AssetDocument } from './schemas/asset.schema';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async create(dto: CreateAssetDto): Promise<Asset> {
    try {
      const created = new this.assetModel(dto);
      return await created.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error creating asset');
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

  async update(id: string, dto: UpdateAssetDto): Promise<Asset> {
    try {
      const updated = await this.assetModel
        .findOneAndUpdate({ id }, dto, { new: true })
        .exec();
      if (!updated)
        throw new NotFoundException(`Asset with id ${id} not found`);
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating asset');
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
