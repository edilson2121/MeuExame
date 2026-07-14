import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPageDto: CreatePageDto, @Request() req) {
    return this.pagesService.create(createPageDto, req.user.id);
  }

  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  findAllAdmin(@Request() req) {
    return this.pagesService.findAll(req.user.id);
  }

  @Get('admin/:id')
  @UseGuards(AuthGuard('jwt'))
  findOneAdmin(@Param('id') id: string, @Request() req) {
    return this.pagesService.findOneAdmin(id, req.user.id);
  }

  @Patch('admin/:id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto, @Request() req) {
    return this.pagesService.update(id, updatePageDto, req.user.id);
  }

  @Patch('admin/:id/publish')
  @UseGuards(AuthGuard('jwt'))
  publish(@Param('id') id: string, @Request() req) {
    return this.pagesService.publish(id, req.user.id);
  }

  @Patch('admin/:id/archive')
  @UseGuards(AuthGuard('jwt'))
  archive(@Param('id') id: string, @Request() req) {
    return this.pagesService.archive(id, req.user.id);
  }

  @Delete('admin/:id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Request() req) {
    return this.pagesService.remove(id, req.user.id);
  }

  @Get('menu')
  findMenu() {
    return this.pagesService.findPublishedMenu();
  }

  @Get('public')
  findPublished() {
    return this.pagesService.findPublished();
  }

  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }
}
