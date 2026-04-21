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

    async getAvailableTables(
        shopId: number,
        startTime: Date,
        endTime: Date,
    ) {
        // 1. หาโต๊ะทั้งหมดในร้าน
        const tables = await this.prisma.table.findMany({
            where: { shopId },
        })

        // 2. หา booking ที่ชนเวลา
        const bookings = await this.prisma.booking.findMany({
            where: {
                status: 'confirmed',
                table: { shopId },
                OR: [
                    {
                        startTime: { lt: endTime },
                        endTime: { gt: startTime },
                    },
                ],
            },
        })

        const bookedTableIds = bookings.map(b => b.tableId)

        // 3. filter โต๊ะที่ว่าง
        const availableTables = tables.filter(
            t => !bookedTableIds.includes(t.id),
        )

        return availableTables
    }

    // เพิ่มโต๊ะ
    async createTable(shopId: number, number: number, capacity: number) {
        return this.prisma.table.create({
            data: {
                shopId,
                number,
                capacity,
            },
        })
    }

    // ดูโต๊ะทั้งหมดในร้าน
    async getTables(shopId: number) {
        return this.prisma.table.findMany({
            where: { shopId },
            orderBy: { number: 'asc' },
        })
    }

    // แก้ไขโต๊ะ
    async updateTable(
        tableId: number,
        data: { number?: number; capacity?: number },
    ) {
        return this.prisma.table.update({
            where: { id: tableId },
            data,
        })
    }

    // ลบโต๊ะ
    async deleteTable(tableId: number) {
        return this.prisma.table.delete({
            where: { id: tableId },
        })
    }
}