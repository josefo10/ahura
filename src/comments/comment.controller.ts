import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
//import { ApikeyGuard } from 'src/auth/guards/apikey.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Comment } from './schemas/comment.schema';

//@UseGuards(ApikeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Roles('usuario', 'administrador', 'super_administrador')
  create(@Body() createDto: CreateCommentDto) {
    return this.commentService.create(createDto);
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
    type: [Comment],
  })
  @Get()
  @Roles('usuario', 'administrador', 'super_administrador')
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment found', type: Comment })
  @Roles('usuario', 'administrador', 'super_administrador')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }
  //solo modifica el que lo creo.
  @Patch(':id/:authorId')
  @Roles('usuario', 'administrador', 'super_administrador')
  update(
    @Param('id') id: string,
    @Param('authorId') authorId: string,
    @Body() updateDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, authorId, updateDto);
  }
  //solo el que lo creo o los admin
  @Delete(':id/:authorId')
  @Roles('usuario', 'administrador', 'super_administrador')
  remove(@Param('id') id: string, @Param('authorId') authorId: string) {
    return this.commentService.remove(id, authorId);
  }
}
