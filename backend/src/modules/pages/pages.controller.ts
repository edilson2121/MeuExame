import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Request() req, @Body() data: CreatePageDto) {
    return this.pagesService.createPage(req.user.id, data);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.pagesService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() data: Partial<CreatePageDto>) {
    return this.pagesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.pagesService.delete(id);
  }

  @Patch(':id/publish')
  @UseGuards(AuthGuard('jwt'))
  publish(@Param('id') id: string) {
    return this.pagesService.publish(id);
  }

  @Get('menu')
  getMenu() {
    return this.pagesService.getMenuPages();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }
}
