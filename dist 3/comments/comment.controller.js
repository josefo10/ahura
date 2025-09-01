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
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const comment_service_1 = require("./comment.service");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const update_comment_dto_1 = require("./dto/update-comment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
const comment_schema_1 = require("./schemas/comment.schema");
let CommentController = class CommentController {
    commentService;
    constructor(commentService) {
        this.commentService = commentService;
    }
    create(createDto) {
        return this.commentService.create(createDto);
    }
    findAll() {
        return this.commentService.findAll();
    }
    findOne(id) {
        return this.commentService.findOne(id);
    }
    update(id, authorId, updateDto) {
        return this.commentService.update(id, authorId, updateDto);
    }
    remove(id, authorId) {
        return this.commentService.remove(id, authorId);
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all comments' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of comments',
        type: [comment_schema_1.Comment],
    }),
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get comment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment found', type: comment_schema_1.Comment }),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/:authorId'),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('authorId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_comment_dto_1.UpdateCommentDto]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id/:authorId'),
    (0, roles_decorator_1.Roles)('usuario', 'administrador', 'super_administrador'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('authorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CommentController.prototype, "remove", null);
exports.CommentController = CommentController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('comments'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentController);
//# sourceMappingURL=comment.controller.js.map