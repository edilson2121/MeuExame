import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly smtpHost: string;
  private readonly smtpPort: number;
  private readonly smtpUser: string;
  private readonly smtpPass: string;

  constructor(private configService: ConfigService) {
    this.smtpHost = this.configService.get('SMTP_HOST', '');
    this.smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    this.smtpUser = this.configService.get('SMTP_USER', '');
    this.smtpPass = this.configService.get('SMTP_PASS', '');
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Se não há configuração de SMTP, apenas log
      if (!this.smtpHost || !this.smtpUser) {
        this.logger.log(`[DEV MODE] Email would be sent to: ${options.to}`);
        this.logger.log(`Subject: ${options.subject}`);
        return true;
      }

      // Em produção, usar nodemailer
      // Por enquanto, apenas logamos
      this.logger.log(`Email sent to: ${options.to}`);
      this.logger.log(`Subject: ${options.subject}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
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

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
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

  async sendPaymentConfirmation(email: string, amount: number, plan: string): Promise<boolean> {
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

  async sendExamResultEmail(email: string, examTitle: string, score: number): Promise<boolean> {
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
}
