import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async create(createBannerDto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        ...createBannerDto,
        startDate: createBannerDto.startDate ? new Date(createBannerDto.startDate) : null,
        endDate: createBannerDto.endDate ? new Date(createBannerDto.endDate) : null,
      },
    });
  }

  async findAll() {
    return this.prisma.banner.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findActive(userRole?: string) {
    const now = new Date();
    
    return this.prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          { target: 'all' },
          { target: userRole as any },
        ],
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found');
    }

    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto) {
    await this.findOne(id);

    return this.prisma.banner.update({
      where: { id },
      data: {
        ...updateBannerDto,
        startDate: updateBannerDto.startDate ? new Date(updateBannerDto.startDate) : undefined,
        endDate: updateBannerDto.endDate ? new Date(updateBannerDto.endDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.banner.delete({
      where: { id },
    });
  }

  async toggleActive(id: string) {
    const banner = await this.findOne(id);

    return this.prisma.banner.update({
      where: { id },
      data: { isActive: !banner.isActive },
    });
  }
}
