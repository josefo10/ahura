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
exports.AssetController = void 0;
const common_1 = require("@nestjs/common");
const asset_service_1 = require("./asset.service");
const create_asset_dto_1 = require("./dto/create-asset.dto");
const update_asset_dto_1 = require("./dto/update-asset.dto");
const find_assets_query_dto_1 = require("./dto/find-assets.query.dto");
const apikey_guard_1 = require("../auth/guards/apikey.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const asset_schema_1 = require("./schemas/asset.schema");
let AssetController = class AssetController {
    assetService;
    constructor(assetService) {
        this.assetService = assetService;
    }
    create(dto) {
        return this.assetService.create(dto);
    }
    findAll(q) {
        return this.assetService.findAll(q);
    }
    findOne(id) {
        return this.assetService.findOne(id);
    }
    update(id, dto) {
        return this.assetService.update(id, dto);
    }
    remove(id) {
        return this.assetService.remove(id);
    }
};
exports.AssetController = AssetController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('administrador', 'super_administrador'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_dto_1.CreateAssetDto]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all assets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of assets', type: [asset_schema_1.Asset] }),
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_assets_query_dto_1.FindAssetsQueryDto]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get asset by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Asset found', type: asset_schema_1.Asset }),
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('administrador', 'super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_asset_dto_1.UpdateAssetDto]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('administrador', 'super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetController.prototype, "remove", null);
exports.AssetController = AssetController = __decorate([
    (0, common_1.UseGuards)(apikey_guard_1.ApikeyGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('assets'),
    __metadata("design:paramtypes", [asset_service_1.AssetService])
], AssetController);
//# sourceMappingURL=asset.controller.js.map