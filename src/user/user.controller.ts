import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WebResponse } from 'src/model/web.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUser } from './dto/response-user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/login-user.dto';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<WebResponse<ResponseUser>> {
    const result = await this.userService.create(createUserDto);
    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: UserLoginDto,
  ): Promise<WebResponse<ResponseUser>> {
    const result = await this.userService.login(request);

    return {
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
