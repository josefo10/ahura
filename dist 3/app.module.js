"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("@nestjs/axios");
const user_module_1 = require("./users/user.module");
const logger_module_1 = require("./loggers/logger.module");
const comment_module_1 = require("./comments/comment.module");
const asset_module_1 = require("./assets/asset.module");
const config_1 = require("@nestjs/config");
const upload_module_1 = require("./upload/upload.module");
const auth_module_1 = require("./auth/auth.module");
const catalog_module_1 = require("./catalogs/catalog.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            mongoose_1.MongooseModule.forRoot(`mongodb+srv://josefo1020:UHkcghGz8hgssLz8@cluster0.naebbm1.mongodb.net/AHURA`),
            user_module_1.UserModule,
            logger_module_1.LoggerModule,
            comment_module_1.CommentModule,
            asset_module_1.AssetModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            upload_module_1.UploadModule,
            auth_module_1.AuthModule,
            catalog_module_1.CatalogModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map