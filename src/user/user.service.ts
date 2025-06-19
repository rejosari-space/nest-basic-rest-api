import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ResponseUser } from './dto/response-user';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { ValidationService } from '../common/validation.service';
import { PrismaService } from '../common/prisma.service';
import { UserLoginDto } from './dto/login-user.dto';
import { v4 as uuid } from 'uuid';
@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseUser> {
    this.logger.info(
      `Cretaing user with data : ${JSON.stringify(createUserDto)}`,
    );
    const requestBody: CreateUserDto = this.validationService.validate(
      UserValidation.CREATEUSER,
      createUserDto,
    );

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: requestBody.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exist', 400);
    }

    requestBody.password = await bcrypt.hash(requestBody.password, 10);

    const user = await this.prismaService.user.create({
      data: requestBody,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: UserLoginDto): Promise<ResponseUser> {
    this.logger.info(`User login with data : ${JSON.stringify(request)}`);

    let userRequest: UserLoginDto = this.validationService.validate(
      UserValidation.LOGINUSER,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: userRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Usernam or password is incorrect', 401);
    }

    const isPasswordvalid = await bcrypt.compare(
      userRequest.password,
      user.password,
    );

    if (!isPasswordvalid) {
      throw new HttpException('Usernam or password is incorrect', 401);
    }

    user = await this.prismaService.user.update({
      where: {
        username: userRequest.username,
      },

      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
