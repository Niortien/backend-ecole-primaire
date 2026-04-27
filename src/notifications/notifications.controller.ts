import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('email')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Envoyer un email' })
  sendEmail(@Body() dto: SendEmailDto): Promise<void> {
    return this.notificationsService.sendEmail(dto);
  }
}
