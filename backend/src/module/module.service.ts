import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(instructorId: string, dto: CreateModuleDto) {
    return this.prisma.module.create({
      data: {
        instructorId,
        moduleName: dto.moduleName,
        description: dto.description,
        moduleCode: dto.moduleCode,
      },
    });
  }

  async findAll() {
    return this.prisma.module.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            labInstances: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        labInstances: {
          include: {
            _count: {
              select: {
                experimentSteps: true,
              },
            },
          },
        },
      },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return module;
  }

  async findByInstructor(instructorId: string) {
    return this.prisma.module.findMany({
      where: { instructorId },
      include: {
        _count: {
          select: {
            labInstances: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, dto: UpdateModuleDto) {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return this.prisma.module.update({
      where: { id },
      data: {
        moduleName: dto.moduleName,
        description: dto.description,
        moduleCode: dto.moduleCode,
      },
    });
  }

  async delete(id: string) {
    const module = await this.prisma.module.findUnique({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return this.prisma.module.delete({
      where: { id },
    });
  }
}
