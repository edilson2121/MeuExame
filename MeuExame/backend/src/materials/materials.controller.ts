import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, HttpCode } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { CreateMaterialDto, UpdateMaterialDto, SubmitExamDto } from './dto/material.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('materials')
export class MaterialsController {
  constructor(private readonly materialsService: MaterialsService) {}

  // =============================================
  // ADMIN ROUTES
  // =============================================

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Request() req, @Body() dto: CreateMaterialDto) {
    return this.materialsService.createMaterial(req.user.id, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return this.materialsService.updateMaterial(req.user.id, id, dto);
  }

  @Put(':id/block')
  @UseGuards(AuthGuard('jwt'))
  async toggleBlock(@Request() req, @Param('id') id: string, @Body() data: { block: boolean; reason?: string }) {
    return this.materialsService.toggleBlock(req.user.id, id, data.block, data.reason);
  }

  @Put(':id/publish')
  @UseGuards(AuthGuard('jwt'))
  async togglePublish(@Param('id') id: string, @Body() data: { publish: boolean }) {
    return this.materialsService.togglePublish(id, data.publish);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  async getAdminMaterials(@Query('institutionId') institutionId?: string) {
    return this.materialsService.getAdminMaterials(institutionId);
  }

  // =============================================
  // PUBLIC ROUTES
  // =============================================

  @Get('institution/:institutionId')
  async getPublishedMaterials(
    @Param('institutionId') institutionId: string,
    @Query('subjectId') subjectId?: string
  ) {
    return this.materialsService.getPublishedMaterials(institutionId, subjectId);
  }

  @Get('institution/:institutionId/page')
  async getInstitutionPage(@Param('institutionId') institutionId: string) {
    return this.materialsService.getInstitutionPage(institutionId);
  }

  @Get(':id')
  async getMaterialDetails(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id;
    return this.materialsService.getMaterialDetails(id, userId);
  }

  // =============================================
  // USER ROUTES
  // =============================================

  @Post('submit')
  @UseGuards(AuthGuard('jwt'))
  async submitExam(@Request() req, @Body() dto: SubmitExamDto) {
    return this.materialsService.submitExam(req.user.id, dto);
  }

  @Get('user/results')
  @UseGuards(AuthGuard('jwt'))
  async getUserResults(@Request() req) {
    return this.materialsService.getUserResults(req.user.id);
  }

  @Get('user/stats')
  @UseGuards(AuthGuard('jwt'))
  async getUserStats(@Request() req) {
    return this.materialsService.getUserStats(req.user.id);
  }
}
