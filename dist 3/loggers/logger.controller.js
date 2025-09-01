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
exports.LoggerController = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("./logger.service");
const create_logger_dto_1 = require("./dto/create-logger.dto");
const update_logger_dto_1 = require("./dto/update-logger.dto");
const apikey_guard_1 = require("../auth/guards/apikey.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const logger_schema_1 = require("./schemas/logger.schema");
let LoggerController = class LoggerController {
    loggerService;
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    create(createDto) {
        return this.loggerService.create(createDto);
    }
    findAll() {
        return this.loggerService.findAll();
    }
    findOne(id) {
        return this.loggerService.findOne(id);
    }
    update(id, updateDto) {
        return this.loggerService.update(id, updateDto);
    }
    remove(id) {
        return this.loggerService.remove(id);
    }
};
exports.LoggerController = LoggerController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_logger_dto_1.CreateLoggerDto]),
    __metadata("design:returntype", void 0)
], LoggerController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all loggers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of loggers', type: [logger_schema_1.Logger] }),
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('super_administrador'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoggerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get logger by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logger found', type: logger_schema_1.Logger }),
    (0, roles_decorator_1.Roles)('super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoggerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_logger_dto_1.UpdateLoggerDto]),
    __metadata("design:returntype", void 0)
], LoggerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LoggerController.prototype, "remove", null);
exports.LoggerController = LoggerController = __decorate([
    (0, common_1.UseGuards)(apikey_guard_1.ApikeyGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('loggers'),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], LoggerController);
//# sourceMappingURL=logger.controller.js.map