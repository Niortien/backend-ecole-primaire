import { Injectable } from '@nestjs/common';
import { EmailService } from './channels/email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  sendEmail(dto: SendEmailDto): Promise<void> {
    return this.emailService.send(dto);
  }
}
