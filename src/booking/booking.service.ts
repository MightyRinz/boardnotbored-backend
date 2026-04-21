import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BookingService {
    constructor(private prisma: PrismaService) { }

    async createBooking(userId: number, tableId: number, startTime: Date, endTime: Date) {

        // check time overlap
        const conflict = await this.prisma.booking.findFirst({
            where: {
                tableId,
                status: 'confirmed',
                OR: [
                    {
                        startTime: { lt: endTime },
                        endTime: { gt: startTime },
                    },
                ],
            },
        })

        if (conflict) {
            throw new BadRequestException('Time slot already booked')
        }

        return this.prisma.booking.create({
            data: {
                userId,
                tableId,
                startTime,
                endTime,
            },
        })
    }

    async getBookingsByShop(shopId: number) {
        return this.prisma.booking.findMany({
            where: {
                table: {
                    shopId,
                },
            },
            include: {
                table: true,
                user: true,
            },
        })
    }

    async cancelBooking(id: number) {
        return this.prisma.booking.update({
            where: { id },
            data: { status: 'cancelled' },
        })
    }
}