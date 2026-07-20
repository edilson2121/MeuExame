"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
        this.smtpHost = this.configService.get('SMTP_HOST', '');
        this.smtpPort = this.configService.get('SMTP_PORT', 587);
        this.smtpUser = this.configService.get('SMTP_USER', '');
        this.smtpPass = this.configService.get('SMTP_PASS', '');
    }
    async sendEmail(options) {
        try {
            if (!this.smtpHost || !this.smtpUser) {
                this.logger.log(`[DEV MODE] Email would be sent to: ${options.to}`);
                this.logger.log(`Subject: ${options.subject}`);
                return true;
            }
            this.logger.log(`Email sent to: ${options.to}`);
            this.logger.log(`Subject: ${options.subject}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            return false;
        }
    }
    async sendWelcomeEmail(email, name) {
        return this.sendEmail({
            to: email,
            subject: 'Bem-vindo ao MeuExame! 🎓',
            html: `
        <h1>Bem-vindo, ${name}!</h1>
        <p>Obrigado por se registar no MeuExame.</p>
        <p>Aqui poderá:</p>
        <ul>
          <li>Praticar exames de admissão</li>
          <li>Acessar conteúdos exclusivos</li>
          <li>Acompanhar seu progresso</li>
        </ul>
        <p>Boa sorte nos seus estudos!</p>
      `,
        });
    }
    async sendPasswordResetEmail(email, resetToken) {
        const resetUrl = `${this.configService.get('APP_URL', 'http://localhost:3000')}/reset-password?token=${resetToken}`;
        return this.sendEmail({
            to: email,
            subject: 'Recuperação de Palavra-passe',
            html: `
        <h1>Recuperar Palavra-passe</h1>
        <p>Recebemos um pedido para redefinir sua palavra-passe.</p>
        <p>Clique no link abaixo para criar uma nova palavra-passe:</p>
        <a href="${resetUrl}" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Palavra-passe</a>
        <p>Este link expira em 1 hora.</p>
        <p>Se não solicitou esta recuperação, ignore este email.</p>
      `,
        });
    }
    async sendPaymentConfirmation(email, amount, plan) {
        return this.sendEmail({
            to: email,
            subject: 'Confirmação de Pagamento - MeuExame',
            html: `
        <h1>Pagamento Confirmado! ✅</h1>
        <p>Seu pagamento foi processado com sucesso.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 400px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Plano:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${plan}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Valor:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${amount} MZN</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Data:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString('pt-MZ')}</td>
          </tr>
        </table>
        <p>Obrigado pela confiança!</p>
      `,
        });
    }
    async sendExamResultEmail(email, examTitle, score) {
        return this.sendEmail({
            to: email,
            subject: `Resultados do Exame: ${examTitle}`,
            html: `
        <h1>Resultados do Exame 📝</h1>
        <p>Você completou o exame: <strong>${examTitle}</strong></p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 10px; text-align: center;">
          <h2 style="margin: 0; font-size: 48px; color: ${score >= 50 ? '#22c55e' : '#ef4444'};">${score.toFixed(1)}%</h2>
          <p style="margin: 5px 0;">${score >= 50 ? 'Parabéns! Aprovado!' : 'Não aprovado. Continue tentando!'}</p>
        </div>
        <p>Você pode ver os detalhes completos no seu painel do MeuExame.</p>
      `,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map