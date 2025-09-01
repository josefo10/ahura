import { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset, AssetDocument } from './schemas/asset.schema';
import { CatalogService } from 'src/catalogs/catalog.service';
import { FindAssetsQueryDto } from './dto/find-assets.query.dto';
export declare class AssetService {
    private assetModel;
    private readonly catalogs;
    constructor(assetModel: Model<AssetDocument>, catalogs: CatalogService);
    create(createAssetDto: CreateAssetDto): Promise<Asset>;
    update(id: string, updateAssetDto: UpdateAssetDto): Promise<Asset>;
    private escapeRegex;
    private parseSort;
    findAll(query?: FindAssetsQueryDto): Promise<{
        items: Asset[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(id: string): Promise<Asset>;
    remove(id: string): Promise<void>;
}
