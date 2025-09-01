import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FindAssetsQueryDto } from './dto/find-assets.query.dto';
import { Asset } from './schemas/asset.schema';
export declare class AssetController {
    private readonly assetService;
    constructor(assetService: AssetService);
    create(dto: CreateAssetDto): Promise<Asset>;
    findAll(q: FindAssetsQueryDto): Promise<{
        items: Asset[];
        page: number;
        limit: number;
        total: number;
    }>;
    findOne(id: string): Promise<Asset>;
    update(id: string, dto: UpdateAssetDto): Promise<Asset>;
    remove(id: string): Promise<void>;
}
