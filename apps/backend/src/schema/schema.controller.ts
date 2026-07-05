import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';

import { Authorized } from '@/auth/decorators/authorized.decorator';
import { JwtGuard } from '@/auth/guards/auth.guard';

import { SaveSchemaDto } from './dto/save-schema.dto';
import { SchemaService } from './schema.service';

@UseGuards(JwtGuard)
@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get()
  public async get(@Authorized('id') userId: string) {
    return this.schemaService.get(userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  public async upsert(
    @Authorized('id') userId: string,
    @Body() dto: SaveSchemaDto,
  ) {
    return this.schemaService.upsert(userId, dto.content);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Authorized('id') userId: string) {
    return this.schemaService.remove(userId);
  }
}
