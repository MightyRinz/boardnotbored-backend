import { Controller, Get, Param, Query } from '@nestjs/common'
import { BoardgameService } from './boardgame.service'

@Controller('boardgames')
export class BoardgameController {
  constructor(private service: BoardgameService) {}

  @Get()
  getAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('sort') sort = 'rating',
    @Query('q') q?: string,
  ) {
    return this.service.findAll(
      Number(page),
      Number(limit),
      sort,
      q,
    )
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.service.search(q)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.findById(Number(id))
  }
}