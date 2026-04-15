import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class BoardgameService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    page = 1,
    limit = 20,
    sort = 'rating',
    q?: string,
    category?: string,
  ) {
    let where: any = {}
    let orderBy: any = { bayesAverage: 'desc' }

    //  search
    if (q) {
      where.name = {
        contains: q,
        mode: 'insensitive',
      }
    }

    //  category filter
    if (category === 'strategy') {
      where.strategyRank = { not: null }
    }

    if (category === 'party') {
      where.partyRank = { not: null }
    }

    if (category === 'family') {
      where.familyRank = { not: null }
    }

    //  sort (priority สูงสุด)
    if (sort === 'users') {
      orderBy = { usersRated: 'desc' }
    }

    else if (sort === 'rank') {
      orderBy = { rank: 'asc' }
      where.rank = { gt: 0 }
    }

    else if (sort === 'category' && category === 'strategy') {
      orderBy = { strategyRank: 'asc' }
    }

    else if (sort === 'category' && category === 'party') {
      orderBy = { partyRank: 'asc' }
    }

    else if (sort === 'category' && category === 'family') {
      orderBy = { familyRank: 'asc' }
    }

    // default = rating (bayesAverage)
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