import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DynamicPagesService } from './dynamic-pages.service';
import { CreateDynamicPageDto } from './dto/create-dynamic-page.dto';
import { UpdateDynamicPageDto } from './dto/update-dynamic-page.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dynamic-pages')
export class DynamicPagesController {
  constructor(private readonly dynamicPagesService: DynamicPagesService) {}

  @Get()
  findAll() {
    return this.dynamicPagesService.findAll();
  }

  @Get('published')
  findPublished() {
    return this.dynamicPagesService.findPublished();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.dynamicPagesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicPagesService.findOne(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createDynamicPageDto: CreateDynamicPageDto) {
    return this.dynamicPagesService.create(createDynamicPageDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateDynamicPageDto: UpdateDynamicPageDto) {
    return this.dynamicPagesService.update(id, updateDynamicPageDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.dynamicPagesService.remove(id);
  }
}
