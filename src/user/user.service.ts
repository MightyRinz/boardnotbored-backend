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
        // 1. เกมที่ user เล่น
        const myGames = await this.prisma.userGameInteraction.findMany({
            where: { userId },
        })

        const myGameIds = myGames.map(g => g.gameId)

        // 2. หา interactions ของ user อื่นที่มี overlap
        const others = await this.prisma.userGameInteraction.findMany({
            where: {
                gameId: { in: myGameIds },
                userId: { not: userId },
            },
        })

        // 3. นับ similarity (userId -> score)
        const similarityMap: Record<number, number> = {}

        for (const o of others) {
            similarityMap[o.userId] = (similarityMap[o.userId] || 0) + 1
        }

        // 4. หา candidate games
        const candidates = await this.prisma.userGameInteraction.findMany({
            where: {
                userId: { in: Object.keys(similarityMap).map(Number) },
                gameId: { notIn: myGameIds },
            },
            include: {
                game: true,
            },
        })

        // 5. score เกม (weighted)
        const scoreMap: Record<number, { game: any; score: number }> = {}

        for (const c of candidates) {
            const sim = similarityMap[c.userId] || 0
            const rating = c.rating || 3

            const weight = sim * rating

            if (!scoreMap[c.gameId]) {
                scoreMap[c.gameId] = { game: c.game, score: 0 }
            }

            scoreMap[c.gameId].score += weight
        }

        // 6. sort
        const result = Object.values(scoreMap)
            .sort((a, b) => b.score - a.score)
            .slice(0, 20)

        return result
    }
}
