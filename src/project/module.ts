import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { JwtModule } from '@nestjs/jwt';
import { ProjectService } from './service/project.service';
import { PrismaService } from '../lib/prisma';
import { ConfigModule } from '@nestjs/config';
import { ProjectScheduler } from './scheduler/project.scheduler';
@Module({
  imports: [
    ConfigModule.forRoot(), 
    ProjectModule,
    JwtModule.register({
      global: true, 
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '300s' },
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectScheduler, PrismaService],
})
export class ProjectModule {}
