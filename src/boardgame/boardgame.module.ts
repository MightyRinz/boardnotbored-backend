import { Module } from '@nestjs/common'
import { BoardgameService } from './boardgame.service'
import { BoardgameController } from './boardgame.controller'
import { PrismaModule } from '../prisma/prisma.module' // 👈 เพิ่มบรรทัดนี้

@Module({
  imports: [PrismaModule], // 👈 สำคัญที่สุด
  controllers: [BoardgameController],
  providers: [BoardgameService],
})
export class BoardgameModule {}