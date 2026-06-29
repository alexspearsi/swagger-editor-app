import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';

@Module({
  imports: [PrismaModule],
  controllers: [SchemaController],
  providers: [SchemaService],
})
export class SchemaModule {}
