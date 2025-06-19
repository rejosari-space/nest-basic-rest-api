import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAllUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
      },
    });
  }
}
