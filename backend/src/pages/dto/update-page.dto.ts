export class UpdatePageDto {
  title?: string;
  slug?: string;
  content?: string;
  description?: string;
  keywords?: string;
  template?: string;
  showInMenu?: boolean;
  menuOrder?: number;
  status?: string;
  sections?: UpdatePageSectionDto[];
}

export class UpdatePageSectionDto {
  id?: string;
  type?: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  settings?: any;
  sortOrder?: number;
  isActive?: boolean;
}
