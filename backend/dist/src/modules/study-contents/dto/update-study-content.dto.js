"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudyContentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_study_content_dto_1 = require("./create-study-content.dto");
class UpdateStudyContentDto extends (0, mapped_types_1.PartialType)(create_study_content_dto_1.CreateStudyContentDto) {
}
exports.UpdateStudyContentDto = UpdateStudyContentDto;
//# sourceMappingURL=update-study-content.dto.js.map