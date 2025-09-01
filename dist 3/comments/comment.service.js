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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
let CommentService = class CommentService {
    commentModel;
    constructor(commentModel) {
        this.commentModel = commentModel;
    }
    async create(createDto) {
        try {
            const created = new this.commentModel(createDto);
            return await created.save();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error creating comment');
        }
    }
    async findAll() {
        try {
            return await this.commentModel.find().exec();
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error fetching comments');
        }
    }
    async findOne(id) {
        try {
            const entry = await this.commentModel.findOne({ id }).exec();
            if (!entry) {
                throw new common_1.NotFoundException(`Comment with id ${id} not found`);
            }
            return entry;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error fetching comment');
        }
    }
    async update(id, authorId, updateDto) {
        console.log('entro al update');
        try {
            const updated = await this.commentModel
                .findOneAndUpdate({ id, authorId }, updateDto, { new: true })
                .exec();
            console.log('Que hiz updata', updated);
            if (!updated) {
                throw new common_1.NotFoundException(`Comment with id ${id} not found or not authored by user ${authorId}`);
            }
            return updated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error updating comment');
        }
    }
    async remove(id, authorId) {
        try {
            const result = await this.commentModel
                .findOneAndDelete({ id, authorId })
                .exec();
            if (!result) {
                throw new common_1.NotFoundException(`Comment with id ${id} not found or not authored by user ${authorId}`);
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException('Error deleting comment');
        }
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CommentService);
//# sourceMappingURL=comment.service.js.map