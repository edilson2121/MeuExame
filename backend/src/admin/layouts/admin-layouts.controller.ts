import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode } from '@nestjs/common';
import { AdminLayoutsService } from './admin-layouts.service';
import { CreateLayoutTemplateDto, UpdateLayoutTemplateDto } from './dto/layout-template.dto';

@Controller('admin/layouts')
export class AdminLayoutsController {
  constructor(private readonly layoutsService: AdminLayoutsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateLayoutTemplateDto) {
    return this.layoutsService.createLayout(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLayoutTemplateDto) {
    return this.layoutsService.updateLayout(id, dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.layoutsService.getLayoutById(id);
  }

  @Get()
  async getAll(@Query('active') active: string = 'false') {
    const onlyActive = active === 'true';
    return this.layoutsService.getAllLayouts(onlyActive);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.layoutsService.deleteLayout(id);
  }
}
