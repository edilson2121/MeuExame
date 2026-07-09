import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AdminPagesService } from './admin-pages.service';
import { CreateInstitutionPageDto, UpdateInstitutionPageDto, PublishInstitutionPageDto } from './dto/institution-page.dto';

@Controller('admin/pages')
export class AdminPagesController {
  constructor(private readonly pagesService: AdminPagesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateInstitutionPageDto) {
    return this.pagesService.createPage(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateInstitutionPageDto) {
    return this.pagesService.updatePage(id, dto);
  }

  @Put(':id/publish')
  async publish(@Param('id') id: string, @Body() dto: PublishInstitutionPageDto) {
    return this.pagesService.publishPage(id, dto);
  }

  @Get('institution/:institutionId')
  async getByInstitution(@Param('institutionId') institutionId: string) {
    return this.pagesService.getPagesByInstitution(institutionId, false);
  }

  @Get('institution/:institutionId/published')
  async getPublishedByInstitution(@Param('institutionId') institutionId: string) {
    return this.pagesService.getPagesByInstitution(institutionId, true);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.pagesService.getPageById(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.pagesService.deletePage(id);
  }
}
