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
}
