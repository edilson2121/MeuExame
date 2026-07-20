import { ExamSimulation } from '@prisma/client';
export interface ISimulationService {
    create(createSimulationDto: any): Promise<ExamSimulation>;
    findAll(): Promise<ExamSimulation[]>;
    findOne(id: string): Promise<ExamSimulation>;
    update(id: string, updateSimulationDto: any): Promise<ExamSimulation>;
    remove(id: string): Promise<ExamSimulation>;
    findByUser(userId: string): Promise<ExamSimulation[]>;
    findByExam(examId: string): Promise<ExamSimulation[]>;
    startSimulation(examId: string, userId: string): Promise<ExamSimulation>;
    completeSimulation(id: string, answers: any): Promise<ExamSimulation>;
    calculateScore(id: string): Promise<number>;
}
