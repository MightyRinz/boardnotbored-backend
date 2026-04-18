import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ShopService {
    constructor(private prisma: PrismaService) { }

    createShop(name: string, address?: string) {
        return this.prisma.shop.create({
            data: { name, address },
        })
    }

    addGameToShop(shopId: number, gameId: number) {
        return this.prisma.shopGame.create({
            data: { shopId, gameId },
        })
    }

    getShopGames(shopId: number) {
        return this.prisma.shopGame.findMany({
            where: { shopId },
            include: {
                game: true,
            },
        })
    }
}