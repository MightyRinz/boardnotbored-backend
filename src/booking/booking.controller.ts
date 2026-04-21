import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common'
import { BookingService } from './booking.service'

@Controller('booking')
export class BookingController {
    constructor(private bookingService: BookingService) { }

    @Post()
    create(@Body() body) {
        return this.bookingService.createBooking(
            body.userId,
            body.tableId,
            new Date(body.startTime),
            new Date(body.endTime),
        )
    }

    @Get('shop/:shopId')
    getByShop(@Param('shopId') shopId: string) {
        return this.bookingService.getBookingsByShop(Number(shopId))
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.bookingService.cancelBooking(Number(id))
    }
}