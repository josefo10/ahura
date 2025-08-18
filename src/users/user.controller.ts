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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ApikeyGuard } from '../auth/guards/apikey.guard';
//import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from './schema/user.schema';

@UseGuards(ApikeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create new user' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  @Get()
  //@Public()
  @Roles('super_administrador')
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details', type: User })
  @Roles('administrador', 'super_administrador')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @Roles('administrador', 'super_administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @Roles('administrador', 'super_administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
