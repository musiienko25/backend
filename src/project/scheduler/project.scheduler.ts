import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProjectService } from '../service/project.service';

@Injectable()
export class ProjectScheduler {
  constructor(private readonly projectService: ProjectService) {}

  @Cron('*/1 * * * *') // This cron expression runs every minute
  async handleExpiredProjects() {
    await this.projectService.updateExpiredProjects();
  }
}
