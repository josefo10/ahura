import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset } from '../domain/asset.entity';

export class AssetRepository {
  constructor(@InjectModel('Asset') private assetModel: Model<Asset>) {}

  async create(asset: Asset): Promise<Asset> {
    return this.assetModel.create(asset);
  }
  async findById(id: string): Promise<Asset | null> {
    return this.assetModel.findById(id).exec();
  }
  // Métodos find, update, delete...
}
