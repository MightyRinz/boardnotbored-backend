import { Controller, Post, Body, Get, Param, Query, Patch, Delete } from '@nestjs/common'
import { ShopService } from './shop.service'

@Controller('shops')
export class ShopController {
    constructor(private shopService: ShopService) { }

    @Get()
    getAll() {
        return this.shopService.getAllShops()
    }

    @Post()
    create(@Body() body) {
        return this.shopService.createShop(
            body.name,
            body.address,
            body.openingTime,
            body.closingTime,
            body.imageUrl,
        )
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

    @Get(':id/available-tables')
    getAvailableTables(
        @Param('id') id: string,
        @Query('start') start: string,
        @Query('end') end: string,
    ) {
        return this.shopService.getAvailableTables(
            Number(id),
            new Date(start),
            new Date(end),
        )
    }

    // เพิ่มโต๊ะ
    @Post(':id/table')
    createTable(
        @Param('id') id: string,
        @Body() body,
    ) {
        return this.shopService.createTable(
            Number(id),
            body.number,
            body.capacity,
        )
    }

    // ดูโต๊ะทั้งหมด
    @Get(':id/tables')
    getTables(@Param('id') id: string) {
        return this.shopService.getTables(Number(id))
    }

    // แก้ไขโต๊ะ
    @Patch('table/:tableId')
    updateTable(
        @Param('tableId') tableId: string,
        @Body() body,
    ) {
        return this.shopService.updateTable(
            Number(tableId),
            body,
        )
    }

    // ลบโต๊ะ
    @Delete('table/:tableId')
    deleteTable(@Param('tableId') tableId: string) {
        return this.shopService.deleteTable(Number(tableId))
    }
    @Patch(':id/closed')
    setClosed(@Param('id') id: string, @Body() body) {
        return this.shopService.setClosedToday(
            Number(id),
            body.closed,
        )
    }
}