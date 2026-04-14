import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BoardgameModule } from './boardgame/boardgame.module';

@Module({
  imports: [PrismaModule, BoardgameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
