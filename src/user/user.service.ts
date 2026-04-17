import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createUser(email: string, name?: string) {
        return this.prisma.user.create({
            data: {
                email,
                name,
            },
        });
    }

    async interactGame(userId: number, gameId: number, rating?: number) {
        return this.prisma.userGameInteraction.upsert({
            where: {
                userId_gameId: { userId, gameId },
            },
            update: {
                rating,
                played: true,
            },
            create: {
                userId,
                gameId,
                rating,
                played: true,
            },
        });
    }
    async getUserInteractions(userId: number) {
        return this.prisma.userGameInteraction.findMany({
            where: { userId },
            include: {
                game: true,
            },
        })
    }

    async recommend(userId: number) {
        // 1. หาเกมที่ user เล่นแล้ว
        const myGames = await this.prisma.userGameInteraction.findMany({
            where: { userId },
            select: { gameId: true },
        })

        const myGameIds = myGames.map(g => g.gameId)

        // 2. หา user อื่นที่เล่นเกมเดียวกัน
        const similarUsers = await this.prisma.userGameInteraction.findMany({
            where: {
                gameId: { in: myGameIds },
                userId: { not: userId },
            },
            select: { userId: true },
        })

        const similarUserIds = [...new Set(similarUsers.map(u => u.userId))]

        // 3. หาเกมที่ user อื่นเล่น แต่เราไม่เคยเล่น
        const recommendations = await this.prisma.userGameInteraction.findMany({
            where: {
                userId: { in: similarUserIds },
                gameId: { notIn: myGameIds },
            },
            include: {
                game: true,
            },
            take: 20,
        })

        return recommendations
    }
}
