import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FindCommentsQueryDto } from './dto/find-comments.query.dto';
//import { ApikeyGuard } from 'src/auth/guards/apikey.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Comment } from './schemas/comment.schema';

//@UseGuards(ApikeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Roles('usuario', 'administrador', 'super_administrador')
  @ApiOperation({ summary: 'Crear un nuevo comentario' })
  @ApiResponse({
    status: 201,
    description: 'Comentario creado exitosamente',
    type: Comment,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  create(@Body() createDto: CreateCommentDto) {
    return this.commentService.create(createDto);
  }

  @Get()
  @Roles('usuario', 'administrador', 'super_administrador')
  @ApiOperation({ summary: 'Obtener todos los comentarios con filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de comentarios',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Comment' },
        },
        total: { type: 'number', example: 50 },
        page: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 3 },
      },
    },
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Búsqueda global en userName y texto',
  })
  @ApiQuery({
    name: 'assetId',
    required: false,
    description: 'Filtrar por ID del activo',
  })
  @ApiQuery({
    name: 'userName',
    required: false,
    description: 'Filtrar por nombre de usuario',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado del comentario',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
    example: 20,
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  findAll(@Query() query: FindCommentsQueryDto) {
    return this.commentService.findAll(query);
  }

  @Get(':id')
  @Roles('usuario', 'administrador', 'super_administrador')
  @ApiOperation({ summary: 'Obtener un comentario por ID' })
  @ApiParam({ name: 'id', description: 'ID único del comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario encontrado',
    type: Comment,
  })
  @ApiNotFoundResponse({ description: 'Comentario no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }
  @Patch(':id/:authorId')
  @Roles('usuario', 'administrador', 'super_administrador')
  @ApiOperation({ summary: 'Actualizar un comentario (solo el autor)' })
  @ApiParam({ name: 'id', description: 'ID único del comentario' })
  @ApiParam({ name: 'authorId', description: 'ID del autor del comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario actualizado exitosamente',
    type: Comment,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiNotFoundResponse({
    description: 'Comentario no encontrado o no autorizado',
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  update(
    @Param('id') id: string,
    @Param('authorId') authorId: string,
    @Body() updateDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, authorId, updateDto);
  }
  @Delete(':id/:authorId')
  @Roles('usuario', 'administrador', 'super_administrador')
  @ApiOperation({ summary: 'Eliminar un comentario (solo el autor o admin)' })
  @ApiParam({ name: 'id', description: 'ID único del comentario' })
  @ApiParam({ name: 'authorId', description: 'ID del autor del comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminado exitosamente',
  })
  @ApiNotFoundResponse({
    description: 'Comentario no encontrado o no autorizado',
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @ApiBearerAuth('JWT-auth')
  remove(@Param('id') id: string, @Param('authorId') authorId: string) {
    return this.commentService.remove(id, authorId);
  }
}
