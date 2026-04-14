import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BoardgameService {
  constructor(private prisma: PrismaService) {}

  async findAll(page = 1, limit = 20, sort = 'rating') {
    let orderBy: any = { bayesAverage: 'desc' }
    let where: any = {}

    if (sort === 'users') {
      orderBy = { usersRated: 'desc' }
    }

    if (sort === 'rank') {
      orderBy = { rank: 'asc' }
      where = {
        rank: {
          gt: 0,
        },
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.boardGame.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        where,
      }),
      this.prisma.boardGame.count({ where }),
    ])

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
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