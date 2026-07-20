import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { StudyContentsService } from '../services/study-contents.service';
import { CreateStudyContentDto } from '../dto/create-study-content.dto';
import { UpdateStudyContentDto } from '../dto/update-study-content.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('study-contents')
export class StudyContentsController {
  constructor(private readonly studyContentsService: StudyContentsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() createStudyContentDto: CreateStudyContentDto) {
    return this.studyContentsService.create(createStudyContentDto);
  }

  @Get()
  findAll() {
    return this.studyContentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studyContentsService.findOne(id);
  }

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.studyContentsService.findBySubject(subjectId);
  }

  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.studyContentsService.findByAuthor(authorId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  update(@Param('id') id: string, @Body() updateStudyContentDto: UpdateStudyContentDto) {
    return this.studyContentsService.update(id, updateStudyContentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string) {
    return this.studyContentsService.remove(id);
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  publish(@Param('id') id: string) {
    return this.studyContentsService.publishContent(id);
  }

  @Post(':id/views')
  incrementViews(@Param('id') id: string) {
    return this.studyContentsService.incrementViews(id);
  }

  @Post(':id/likes')
  incrementLikes(@Param('id') id: string) {
    return this.studyContentsService.incrementLikes(id);
  }
}
