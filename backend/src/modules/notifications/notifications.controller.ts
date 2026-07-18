import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('test')
  @ApiOperation({ summary: 'Send test email' })
  async sendTestEmail(@Body() body: { email: string }) {
    const result = await this.notificationsService.sendEmail({
      to: body.email,
      subject: 'Teste - MeuExame',
      html: '<h1>Teste de Email</h1><p>Este é um email de teste.</p>',
    });
    return { success: result };
  }
}
