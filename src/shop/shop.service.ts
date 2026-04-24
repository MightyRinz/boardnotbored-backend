import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

function isOpenNow(open?: string, close?: string) {
    if (!open || !close) return false

    const now = new Date()
    const current = now.getHours() * 60 + now.getMinutes()

    const [oh, om] = open.split(':').map(Number)
    const [ch, cm] = close.split(':').map(Number)

    const openMin = oh * 60 + om
    const closeMin = ch * 60 + cm

    // กรณีปกติ (เช่น 10:00 - 22:00)
    if (openMin <= closeMin) {
        return current >= openMin && current <= closeMin
    }
    // กรณีข้ามวัน (เช่น 18:00 - 02:00)
    return current >= openMin || current <= closeMin
}

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
        //  เช็คว่ามี booking ไหม
        const hasBooking = await this.prisma.booking.findFirst({
            where: { tableId },
        })
        // ถ้ามี ห้ามลบ
        if (hasBooking) {
            throw new BadRequestException('Table has bookings')
        }
        // ถ้าไม่มี ลบได้
        return this.prisma.table.delete({
            where: { id: tableId },
        })
    }

    async getAllShops() {
        const shops = await this.prisma.shop.findMany({
            select: {
                id: true,
                name: true,
                address: true,
                openingTime: true,
                closingTime: true,
                _count: {
                    select: {
                        tables: true,
                    },
                },
            },
        })

        return shops.map(shop => ({
            ...shop,
            isOpen: isOpenNow(shop.openingTime, shop.closingTime),
        }))
    }
}