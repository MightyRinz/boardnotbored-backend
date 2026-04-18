import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { ShopService } from './shop.service'

@Controller('shop')
export class ShopController {
    constructor(private shopService: ShopService) { }

    @Post()
    create(@Body() body) {
        return this.shopService.createShop(body.name, body.address)
    }

    @Post('add-game')
    addGame(@Body() body) {
        return this.shopService.addGameToShop(
            body.shopId,
            body.gameId,
        )
    }

    @Get(':id/games')
    getGames(@Param('id') id: string) {
        return this.shopService.getShopGames(Number(id))
    }
}