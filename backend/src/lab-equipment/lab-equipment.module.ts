import { Module } from '@nestjs/common';
import { LabEquipmentController } from './lab-equipment.controller';
import { LabEquipmentService } from './lab-equipment.service';
import { CloudinaryProvider } from '../providers/cloudinary.provider';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LabEquipmentController],
  providers: [LabEquipmentService, CloudinaryProvider, PrismaService],
  exports: [LabEquipmentService],
})
export class LabEquipmentModule {}
