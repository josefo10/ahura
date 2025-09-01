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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schema/user.schema");
let UserService = class UserService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        try {
            const created = new this.userModel(createUserDto);
            const hashPassword = await bcrypt.hash(created.password, 10);
            created.password = hashPassword;
            const model = await created.save();
            const { password, ...rta } = model.toJSON();
            return rta;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error creando el usuario');
        }
    }
    async findAll() {
        try {
            return await this.userModel.find().exec();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error obteniendo usuarios');
        }
    }
    async findOne(id) {
        try {
            const user = await this.userModel.findOne({ id }).exec();
            if (!user) {
                throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            return user;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error buscando el usuario');
        }
    }
    async findByEmail(email) {
        try {
            const user = await this.userModel.findOne({ email }).exec();
            if (!user) {
                throw new common_1.NotFoundException(`Usuario con email ${email} no encontrado`);
            }
            return user;
        }
        catch (error) {
            console.log(error);
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error buscando el usuario');
        }
    }
    async update(id, dto) {
        try {
            const updated = await this.userModel
                .findOneAndUpdate({ id }, dto, { new: true })
                .exec();
            if (!updated) {
                throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
            }
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error actualizando el usuario');
        }
    }
    async remove(id) {
        try {
            const result = await this.userModel.findOneAndDelete({ id }).exec();
            if (!result) {
                throw new common_1.NotFoundException(`Usuario con id ${id} no encontrado`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error eliminando el usuario');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map