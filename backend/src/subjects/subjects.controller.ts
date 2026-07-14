import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsService } from './subjects.service';

const adminGuards = [AuthGuard('jwt'), RolesGuard];

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get('institution/:institutionId')
  findByInstitution(@Param('institutionId') institutionId: string) {
    return this.subjectsService.findByInstitution(institutionId);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.subjectsService.findByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Post()
  @UseGuards(...adminGuards)
  @Roles('ADMIN')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Patch(':id')
  @UseGuards(...adminGuards)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @UseGuards(...adminGuards)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}
