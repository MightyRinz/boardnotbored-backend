import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  createUser(@Body() body) {
    return this.userService.createUser(body.email, body.name)
  }

  @Post('interact')
  interact(@Body() body) {
    return this.userService.interactGame(
      body.userId,
      body.gameId,
      body.rating,
    )
  }

  @Get(':id/interactions')
  getInteractions(@Param('id') id: string) {
    return this.userService.getUserInteractions(Number(id))
  }

  @Get(':id/recommend')
  recommend(@Param('id') id: string) {
    return this.userService.recommend(Number(id))
  }
}