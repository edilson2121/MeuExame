import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ExamsService } from '../services/exams.service';
import { CreateExamDto } from '../dto/create-exam.dto';
import { UpdateExamDto } from '../dto/update-exam.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

interface SubmitAnswerDto {
  questionId: string;
  selectedOption: number;
}

interface SubmitExamDto {
  answers: SubmitAnswerDto[];
}

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.id;
    return this.examsService.findOne(id, userId);
  }

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.examsService.findBySubject(subjectId);
  }

  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.examsService.findByAuthor(authorId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }

  @Post(':id/questions')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  addQuestion(
    @Param('id') id: string,
    @Body() body: { questionId: string; order: number; points: number },
  ) {
    return this.examsService.addQuestion(id, body.questionId, body.order, body.points);
  }

  @Delete(':id/questions/:questionId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  removeQuestion(@Param('id') id: string, @Param('questionId') questionId: string) {
    return this.examsService.removeQuestion(id, questionId);
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  publish(@Param('id') id: string) {
    return this.examsService.publishExam(id);
  }

  @Post(':id/submit')
  @UseGuards(AuthGuard)
  submitExam(
    @Param('id') id: string,
    @Body() submitExamDto: SubmitExamDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.id;
    return this.examsService.submitExam(id, userId, submitExamDto.answers);
  }

  @Get(':id/access')
  @UseGuards(AuthGuard)
  checkAccess(@Param('id') id: string, @Req() req: Request) {
    const userId = req.user?.id;
    return this.examsService.checkExamAccess(id, userId);
  }
}
