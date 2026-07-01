import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create(userId: string, dto: CreateHistoryDto) {
    return this.prismaService.requestHistory.create({
      data: {
        userId,
        url: dto.url,
        method: dto.method,
        statusCode: dto.statusCode ?? null,
        duration: dto.duration,
        requestSize: dto.requestSize ?? null,
        responseSize: dto.responseSize ?? null,
        errorDetails: dto.errorDetails ?? null,
      },
    });
  }

  public async findByUser(userId: string) {
    return this.prismaService.requestHistory.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
