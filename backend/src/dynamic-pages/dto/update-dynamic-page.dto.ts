import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicPageDto } from './create-dynamic-page.dto';

export class UpdateDynamicPageDto extends PartialType(CreateDynamicPageDto) {}
