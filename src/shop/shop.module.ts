import { Module } from '@nestjs/common'
import { ShopService } from './shop.service'
import { ShopController } from './shop.controller'
import { PrismaModule } from '../prisma/prisma.module' // 👈 เพิ่ม

@Module({
  imports: [PrismaModule],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}