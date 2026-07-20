export class CreatePageDto {
  title: string;
  slug: string;
  content: string;
  description?: string;
  keywords?: string;
  template?: string;
  showInMenu?: boolean;
  menuOrder?: number;
  status?: string;
  authorId: string;
  sections?: CreatePageSectionDto[];
}

export class CreatePageSectionDto {
  type: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  settings?: any;
  sortOrder?: number;
}
