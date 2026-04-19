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
        const LIMIT = 20

        // 1. เกมที่ user เล่น
        const myGames = await this.prisma.userGameInteraction.findMany({
            where: { userId },
        })

        //  fallback (cold start)
        if (myGames.length === 0) {
            return this.prisma.boardGame.findMany({
                where: { rank: { gt: 0 } },
                orderBy: [
                    { bayesAverage: 'desc' },
                    { usersRated: 'desc' },
                ],
                take: LIMIT,
            })
        }

        const myGameIds = myGames.map(g => g.gameId)

        // 2. หา users ที่ overlap
        const others = await this.prisma.userGameInteraction.findMany({
            where: {
                gameId: { in: myGameIds },
                userId: { not: userId },
            },
        })

        // 3. similarity (normalize ด้วยจำนวนเกม)
        const similarityMap: Record<number, number> = {}

        for (const o of others) {
            similarityMap[o.userId] = (similarityMap[o.userId] || 0) + 1
        }

        // normalize
        const myGameCount = myGameIds.length
        Object.keys(similarityMap).forEach(uid => {
            similarityMap[Number(uid)] /= myGameCount
        })

        const similarUserIds = Object.keys(similarityMap).map(Number)

        //  fallback ถ้าไม่มี similar user
        if (similarUserIds.length === 0) {
            return this.prisma.boardGame.findMany({
                where: { rank: { gt: 0 } },
                orderBy: { bayesAverage: 'desc' },
                take: LIMIT,
            })
        }

        // 4. หา candidate games
        const candidates = await this.prisma.userGameInteraction.findMany({
            where: {
                userId: { in: similarUserIds },
                gameId: { notIn: myGameIds },
            },
            include: {
                game: true,
            },
        })

        // 5. weighted score (normalize rating)
        const scoreMap: Record<number, { game: any; score: number }> = {}

        for (const c of candidates) {
            const sim = similarityMap[c.userId] || 0
            const rating = (c.rating || 3) / 5   // normalize 0–1

            const weight = sim * rating

            if (!scoreMap[c.gameId]) {
                scoreMap[c.gameId] = { game: c.game, score: 0 }
            }

            scoreMap[c.gameId].score += weight
        }

        // 6. sort + clean response
        const result = Object.values(scoreMap)
            .sort((a, b) => b.score - a.score)
            .slice(0, LIMIT)
            .map(r => ({
                ...r.game,
                score: Number(r.score.toFixed(3)),
            }))

        return result
    }

    async recommendForShop(userId: number, shopId: number) {
        const LIMIT = 20

        // 1. เอา recommend ปกติ
        const recommendations = await this.recommend(userId)

        // 2. เอาเกมในร้าน
        const shopGames = await this.prisma.shopGame.findMany({
            where: { shopId },
            include: {
                game: true,
            },
        })

        const shopGameIds = shopGames.map(g => g.gameId)

        // 3. filter
        const filtered = recommendations.filter(r =>
            shopGameIds.includes(r.id),
        )

        // ถ้ามี → ใช้เลย
        if (filtered.length > 0) {
            return filtered
        }

        // fallback: แสดงเกมในร้านแทน
        return shopGames
            .map(g => g.game)
            .sort((a, b) => (b.bayesAverage ?? 0) - (a.bayesAverage ?? 0))
            .slice(0, LIMIT)
    }

}
