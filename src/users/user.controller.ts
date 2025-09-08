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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { ApikeyGuard } from '../auth/guards/apikey.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './schema/user.schema';

@UseGuards(ApikeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @Public()
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o email ya existe',
  })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @Get()
  @Roles('super_administrador')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiResponse({ status: 200, description: 'Detalles del usuario', type: User })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @Roles('administrador', 'super_administrador')
  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @Roles('administrador', 'super_administrador')
  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID único del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Error interno del servidor' })
  @Roles('administrador', 'super_administrador')
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('api-key')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
