import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BoardgameService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 20, sort = 'rating') {
    let orderBy: any = { bayesAverage: 'desc' }

    if (sort === 'users') {
      orderBy = { usersRated: 'desc' }
    }

    if (sort === 'rank') {
      orderBy = { rank: 'asc' }
    }

    return this.prisma.boardGame.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    })
  }

  findById(id: number) {
    return this.prisma.boardGame.findUnique({
      where: { id },
    })
  }

  search(q: string) {
    return this.prisma.boardGame.findMany({
      where: {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
      take: 20,
    })
  }
}