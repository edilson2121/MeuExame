import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminLayoutsService } from './admin-layouts.service';
import { CreateLayoutTemplateDto, UpdateLayoutTemplateDto } from './dto/layout-template.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('admin/layouts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
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
