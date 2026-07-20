"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDynamicPageDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_dynamic_page_dto_1 = require("./create-dynamic-page.dto");
class UpdateDynamicPageDto extends (0, mapped_types_1.PartialType)(create_dynamic_page_dto_1.CreateDynamicPageDto) {
}
exports.UpdateDynamicPageDto = UpdateDynamicPageDto;
//# sourceMappingURL=update-dynamic-page.dto.js.map