
import { Injectable } from '@nestjs/common';

@Injectable()
export class SubjectsService {

  findAll() {
    return [];
  }

  findByInstitution(institutionId: string) {
    return [];
  }

  findByCourse(courseId: string) {
    return [];
  }

  findOne(id: string) {
    return {
      id,
    };
  }

  create(createSubjectDto: any) {
    return createSubjectDto;
  }

  update(id: string, updateSubjectDto: any) {
    return {
      id,
      ...updateSubjectDto,
    };
  }

  remove(id: string) {
    return {
      deleted: id,
    };
  }

}

