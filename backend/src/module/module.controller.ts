import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User as ClerkUser } from '@clerk/backend';
import { ModuleService } from './module.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user: ClerkUser;
}

@Controller('modules')
export class ModuleController {
  constructor(
    private readonly moduleService: ModuleService,
    private readonly prisma: PrismaService,
  ) {}

  private async getDbUserId(clerkUser: ClerkUser): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
      select: { id: true },
    });

    if (!user) {
      throw new BadRequestException('User not found in database');
    }

    return user.id;
  }

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateModuleDto) {
    const instructorId = await this.getDbUserId(req.user);
    return this.moduleService.create(instructorId, dto);
  }

  @Get()
  async findAll() {
    return this.moduleService.findAll();
  }

  @Get('my-modules')
  async findMyModules(@Req() req: AuthenticatedRequest) {
    const instructorId = await this.getDbUserId(req.user);
    return this.moduleService.findByInstructor(instructorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moduleService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.moduleService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.moduleService.delete(id);
  }
}
