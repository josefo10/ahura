import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';

@Controller('loggers')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Post()
  create(@Body() createDto: CreateLoggerDto) {
    return this.loggerService.create(createDto);
  }

  @Get()
  findAll() {
    return this.loggerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loggerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateLoggerDto) {
    return this.loggerService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loggerService.remove(id);
  }
}
