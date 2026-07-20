import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SimulationsService } from '../services/simulations.service';
import { CreateSimulationDto } from '../dto/create-simulation.dto';
import { UpdateSimulationDto } from '../dto/update-simulation.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('simulations')
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createSimulationDto: CreateSimulationDto) {
    return this.simulationsService.create(createSimulationDto);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.simulationsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.simulationsService.findOne(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  findByUser(@Param('userId') userId: string) {
    return this.simulationsService.findByUser(userId);
  }

  @Get('exam/:examId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findByExam(@Param('examId') examId: string) {
    return this.simulationsService.findByExam(examId);
  }

  @Post('start/:examId')
  @UseGuards(AuthGuard)
  startSimulation(@Param('examId') examId: string, @Body() body: { userId: string }) {
    return this.simulationsService.startSimulation(examId, body.userId);
  }

  @Post(':id/complete')
  @UseGuards(AuthGuard)
  completeSimulation(@Param('id') id: string, @Body() body: { answers: any }) {
    return this.simulationsService.completeSimulation(id, body.answers);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateSimulationDto: UpdateSimulationDto) {
    return this.simulationsService.update(id, updateSimulationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.simulationsService.remove(id);
  }
}
