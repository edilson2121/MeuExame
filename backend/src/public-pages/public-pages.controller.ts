import { Controller, Get, Param } from '@nestjs/common';
import { PublicPagesService } from './public-pages.service';

@Controller('public/pages')
export class PublicPagesController {
  constructor(private readonly pagesService: PublicPagesService) {}

  @Get('institution/:institutionId')
  async getPublishedByInstitution(@Param('institutionId') institutionId: string) {
    return this.pagesService.getPublishedPagesByInstitution(institutionId);
  }

  @Get('institution/:institutionId/slug/:slug')
  async getBySlug(
    @Param('slug') slug: string,
    @Param('institutionId') institutionId: string,
  ) {
    return this.pagesService.getPublishedPageBySlug(slug, institutionId);
  }

  @Get('institution/:institutionId/menu')
  async getMenu(@Param('institutionId') institutionId: string) {
    return this.pagesService.getPublicMenu(institutionId);
  }
}
