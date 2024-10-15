import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/prisma';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(args: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prismaService.project.findMany(args);
  }

  async count(args: Prisma.ProjectCountArgs): Promise<number> {
    return this.prismaService.project.count(args);
  }

  async create(data: Prisma.ProjectCreateInput & { userId: number }): Promise<Project> {
    return this.prismaService.project.create({
      data: {
        name: data.name,
        url: data.url,
        status: data.status,
        deleted: data.deleted ?? false,
        expiredAt: data.expiredAt,
        user: {
          connect: { id: data.userId },
        },
      },
    });
  }

  async update(id: number, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return this.prismaService.project.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: number): Promise<Project> {
    return this.prismaService.project.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
