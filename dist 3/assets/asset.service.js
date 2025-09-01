"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const asset_schema_1 = require("./schemas/asset.schema");
const catalog_service_1 = require("../catalogs/catalog.service");
const mongoose_3 = require("mongoose");
let AssetService = class AssetService {
    assetModel;
    catalogs;
    constructor(assetModel, catalogs) {
        this.assetModel = assetModel;
        this.catalogs = catalogs;
    }
    async create(createAssetDto) {
        try {
            await this.catalogs.validateAssetEnums(createAssetDto);
            const payload = {
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException(error?.message ?? 'Error creating asset');
        }
    }
    async update(id, updateAssetDto) {
        try {
            await this.catalogs.validateAssetEnums(updateAssetDto);
            const updated = await this.assetModel
                .findOneAndUpdate({ id }, updateAssetDto, { new: true })
                .exec();
            if (!updated)
                throw new common_1.NotFoundException(`Asset with id ${id} not found`);
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error updating asset');
        }
    }
    escapeRegex(input) {
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    parseSort(sort) {
        if (!sort)
            return { publishDate: -1 };
        return sort.split(',').reduce((acc, field) => {
            field = field.trim();
            if (!field)
                return acc;
            if (field.startsWith('-'))
                acc[field.substring(1)] = -1;
            else
                acc[field] = 1;
            return acc;
        }, {});
    }
    async findAll(query) {
        try {
            const q = query || {};
            const filter = {};
            if (q.title)
                filter.title = { $regex: this.escapeRegex(q.title), $options: 'i' };
            if (q.description)
                filter.description = {
                    $regex: this.escapeRegex(q.description),
                    $options: 'i',
                };
            if (q.knowledgeType)
                filter.knowledgeType = q.knowledgeType;
            if (q.activeKnowledgeType)
                filter.activeKnowledgeType = q.activeKnowledgeType;
            if (q.format)
                filter.format = q.format;
            if (q.status)
                filter.status = q.status;
            if (q.criticality)
                filter.criticality = q.criticality;
            if (q.origin)
                filter.origin = q.origin;
            if (q.ownerId)
                filter.ownerId = q.ownerId;
            if (q.responsibleOwner)
                filter.responsibleOwner = {
                    $regex: this.escapeRegex(q.responsibleOwner),
                    $options: 'i',
                };
            if (q.confidentiality !== undefined)
                filter.confidentiality = q.confidentiality;
            if (q.publishFrom || q.publishTo) {
                filter.publishDate = {};
                if (q.publishFrom)
                    filter.publishDate.$gte = new Date(q.publishFrom);
                if (q.publishTo)
                    filter.publishDate.$lte = new Date(q.publishTo);
            }
            if (q.keywords?.length) {
                filter.keywords = { $all: q.keywords };
            }
            if (q.ids?.length) {
                filter._id = {
                    $in: q.ids.map((id) => {
                        try {
                            return new mongoose_3.Types.ObjectId(id);
                        }
                        catch {
                            return id;
                        }
                    }),
                };
            }
            if (q.businessIds?.length) {
                filter.id = { $in: q.businessIds };
            }
            if (q.q) {
                const r = { $regex: this.escapeRegex(q.q), $options: 'i' };
                filter.$or = [
                    { title: r },
                    { description: r },
                    { keywords: { $elemMatch: r } },
                ];
            }
            const page = Math.max(1, q.page || 1);
            const limit = Math.min(100, Math.max(1, q.limit || 20));
            const skip = (page - 1) * limit;
            const sort = this.parseSort(q.sort);
            const [items, total] = await Promise.all([
                this.assetModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
                this.assetModel.countDocuments(filter),
            ]);
            return { items, page, limit, total };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error fetching assets');
        }
    }
    async findOne(id) {
        try {
            const asset = await this.assetModel.findOne({ id }).exec();
            if (!asset)
                throw new common_1.NotFoundException(`Asset with id ${id} not found`);
            return asset;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error fetching asset');
        }
    }
    async remove(id) {
        try {
            const result = await this.assetModel.findOneAndDelete({ id }).exec();
            if (!result)
                throw new common_1.NotFoundException(`Asset with id ${id} not found`);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error deleting asset');
        }
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(asset_schema_1.Asset.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        catalog_service_1.CatalogService])
], AssetService);
//# sourceMappingURL=asset.service.js.map