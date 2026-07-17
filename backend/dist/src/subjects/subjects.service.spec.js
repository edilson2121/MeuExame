"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const subjects_service_1 = require("./subjects.service");
describe('SubjectsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [subjects_service_1.SubjectsService],
        }).compile();
        service = module.get(subjects_service_1.SubjectsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=subjects.service.spec.js.map