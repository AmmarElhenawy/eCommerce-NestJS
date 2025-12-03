import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Roles } from './decorator/Roles.decorator';
import { PaginationDto } from './dto/pagination.dto';

@Controller('v1/user')
export class UserController {
  constructor(private readonly userService: UserService,
  ) {}
  
  @Post()
  // @Roles(['admin'])
  // @UseGuards(AuthGuard)
  create(@Body
    (new ValidationPipe({forbidNonWhitelisted:true})) 
    createUserDto: CreateUserDto , @Req() req) {
      return this.userService.create(createUserDto,req.user);
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Query() paginationDto:PaginationDto) {
    return await this.userService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);//+id turn it to number
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
@Controller('v1/userMe')
export class UserMeController {
  constructor(private readonly userService: UserService,
  ) {}
  
  @Roles(['admin','user'])
  @UseGuards(AuthGuard)
  @Get('')
  getME(@Req() req) {
    return this.userService.getMe(req.user);
  }
  
  @Roles(['admin','user'])
  @UseGuards(AuthGuard)
  @Patch('')
  updateMe(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateMe(req.user, updateUserDto);
  }

  @Roles(['user'])
  @UseGuards(AuthGuard)
  @Delete('')
  removeMe(@Req() req ) {
    return this.userService.removeMe(req.user);
  }
}
