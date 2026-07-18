import { Controller, Get, Param, UseGuards, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ResultsService } from '../services/results.service';

@ApiTags('Results')
@Controller('results')
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my results' })
  async getMyResults(@Req() req: any) {
    return this.resultsService.findByUser(req.user.id);
  }

  @Get('exam/:examId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get results for an exam' })
  async getExamResults(
    @Req() req: any,
    @Param('examId', ParseUUIDPipe) examId: string,
  ) {
    return this.resultsService.findByExam(examId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get result by ID' })
  async getResult(@Param('id', ParseUUIDPipe) id: string) {
    return this.resultsService.findOne(id);
  }
}
