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
import { LoggerService } from './logger.service';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';
import { ApikeyGuard } from 'src/auth/guards/apikey.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Logger } from './schemas/logger.schema';

@UseGuards(ApikeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('loggers')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post()
  @Roles('user', 'administrador', 'super_administrador')
  create(@Body() createDto: CreateLoggerDto) {
    return this.loggerService.create(createDto);
  }

  @ApiOperation({ summary: 'Get all loggers' })
  @ApiResponse({ status: 200, description: 'List of loggers', type: [Logger] })
  @Get()
  @Roles('super_administrador')
  findAll() {
    return this.loggerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get logger by ID' })
  @ApiResponse({ status: 200, description: 'Logger found', type: Logger })
  @Roles('super_administrador')
  findOne(@Param('id') id: string) {
    return this.loggerService.findOne(id);
  }
  //super --> no existe
  @Patch(':id')
  @Roles('super_administrador')
  update(@Param('id') id: string, @Body() updateDto: UpdateLoggerDto) {
    return this.loggerService.update(id, updateDto);
  }
  //super
  @Delete(':id')
  @Roles('super_administrador')
  remove(@Param('id') id: string) {
    return this.loggerService.remove(id);
  }
}
