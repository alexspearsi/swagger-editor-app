import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SchemaService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async get(userId: string) {
    return this.prismaService.savedSchema.findUnique({ where: { userId } });
  }

  public async upsert(userId: string, content: string) {
    return this.prismaService.savedSchema.upsert({
      where: { userId },
      update: { content },
      create: { userId, content },
    });
  }

  public async remove(userId: string) {
    const existing = await this.get(userId);

    if (!existing) {
      throw new NotFoundException('Schema not found');
    }

    return this.prismaService.savedSchema.delete({ where: { userId } });
  }
}
