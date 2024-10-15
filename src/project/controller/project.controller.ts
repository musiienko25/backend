import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ProjectListResponse } from '../dto/project-list-response.dto';
import { Project, Prisma, ProjectStatus } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @Request() req,
    @Body() createProjectDto: { name: string; url: string; status: ProjectStatus },
  ): Promise<Project> {
    const userId = req.user.sub as number;
  
    return this.projectService.create({
      ...createProjectDto,
      userId,
      user: {
        connect: { id: userId },
      },
    });
  }
  
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: { name?: string; url?: string },
  ): Promise<Project> {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<Project> {
    return this.projectService.softDelete(id);
  }

  @Get()
  async list(
    @Request() req,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('search') search?: string,
  ): Promise<ProjectListResponse> {
    const userId = req.user.sub as number;

    const filters: Prisma.ProjectWhereInput = {
      userId,
      deleted: false,
    };

    if (search) {
      filters.OR = [
        { name: { contains: search } },
        { url: { contains: search } },
      ];
    }

    const list = await this.projectService.findMany({
      where: filters,
      skip: offset,
      take: limit,
    });

    const total = await this.projectService.count({
      where: filters,
    });

    return {
      data: list,
      total,
      size: list.length,
      offset,
      limit,
    };
  }
}
