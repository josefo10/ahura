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
exports.CatalogController = void 0;
const common_1 = require("@nestjs/common");
const catalog_service_1 = require("./catalog.service");
const create_catalog_dto_1 = require("./dto/create-catalog.dto");
const update_catalog_dto_1 = require("./dto/update-catalog.dto");
const enum_item_dto_1 = require("./dto/enum-item.dto");
const swagger_1 = require("@nestjs/swagger");
let CatalogController = class CatalogController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    get(slug) {
        return this.service.get(slug);
    }
    update(slug, dto) {
        return this.service.update(slug, dto);
    }
    remove(slug) {
        return this.service.remove(slug);
    }
    getEnumKeys(slug) {
        return this.service.getEnumKeys(slug);
    }
    getEnumItems(slug) {
        return this.service.getEnumItems(slug);
    }
    addEnumItem(slug, listName, item) {
        return this.service.addEnumItem(slug, listName, item);
    }
    updateEnumItem(slug, listName, key, patch) {
        return this.service.updateEnumItem(slug, listName, key, patch);
    }
    removeEnumItem(slug, listName, key) {
        return this.service.removeEnumItem(slug, listName, key);
    }
};
exports.CatalogController = CatalogController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new catalog' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The catalog has been created.',
        type: create_catalog_dto_1.CreateCatalogDto,
    }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalog_dto_1.CreateCatalogDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all catalogs' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all catalogs',
        type: [create_catalog_dto_1.CreateCatalogDto],
    }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get a catalog by slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The catalog has been found.',
        type: create_catalog_dto_1.CreateCatalogDto,
    }),
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "get", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update a catalog by slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The catalog has been updated.',
        type: create_catalog_dto_1.CreateCatalogDto,
    }),
    (0, common_1.Patch)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_catalog_dto_1.UpdateCatalogDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete a catalog by slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The catalog has been deleted.',
    }),
    (0, common_1.Delete)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get enum keys by catalog slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of enum keys',
        type: [String],
    }),
    (0, common_1.Get)(':slug/enum-keys'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "getEnumKeys", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get enum items by catalog slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of enum items',
        type: [enum_item_dto_1.EnumItemDto],
    }),
    (0, common_1.Get)(':slug/enum-items'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "getEnumItems", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add an enum item by catalog slug' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The enum item has been added.',
        type: enum_item_dto_1.EnumItemDto,
    }),
    (0, common_1.Post)(':slug/:listName'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('listName')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, enum_item_dto_1.EnumItemDto]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "addEnumItem", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an enum item by catalog slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The enum item has been updated.',
        type: enum_item_dto_1.EnumItemDto,
    }),
    (0, common_1.Patch)(':slug/:listName/:key'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('listName')),
    __param(2, (0, common_1.Param)('key')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "updateEnumItem", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remove an enum item by catalog slug' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'The enum item has been removed.',
    }),
    (0, common_1.Delete)(':slug/:listName/:key'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Param)('listName')),
    __param(2, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CatalogController.prototype, "removeEnumItem", null);
exports.CatalogController = CatalogController = __decorate([
    (0, common_1.Controller)('catalogs'),
    __metadata("design:paramtypes", [catalog_service_1.CatalogService])
], CatalogController);
//# sourceMappingURL=catalog.controller.js.map