import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

const adminGuards = [AuthGuard('jwt'), RolesGuard];

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll() {
    return this.coursesService.findAll();
  }

  @Get('institution/:institutionId')
  async findByInstitution(@Param('institutionId') institutionId: string) {
    return this.coursesService.findByInstitution(institutionId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @UseGuards(...adminGuards)
  @Roles('ADMIN')
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto.name, createCourseDto.institutionId);
  }

  @Put(':id')
  @Patch(':id')
  @UseGuards(...adminGuards)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() updateCourseDto: Partial<CreateCourseDto>) {
    return this.coursesService.update(id, updateCourseDto.name, updateCourseDto.institutionId);
  }

  @Delete(':id')
  @UseGuards(...adminGuards)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
