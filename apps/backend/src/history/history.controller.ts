import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Authorized } from '@/auth/decorators/authorized.decorator';
import { JwtGuard } from '@/auth/guards/auth.guard';

import { CreateHistoryDto } from './dto/create-history.dto';
import { HistoryService } from './history.service';

@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateHistoryDto,
  ) {
    return this.historyService.create(userId, dto);
  }

  @Get()
  public async findAll(@Authorized('id') userId: string) {
    return this.historyService.findByUser(userId);
  }
}
