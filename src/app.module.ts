import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BoardgameModule } from './boardgame/boardgame.module';
import { UserModule } from './user/user.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [PrismaModule, BoardgameModule, UserModule, ShopModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
