import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MessagerieService } from './messagerie.service';
import { SendMessageDto } from './dto/send-message.dto';

@UseGuards(JwtAuthGuard)
@Controller('messagerie')
export class MessagerieController {
  constructor(private readonly service: MessagerieService) {}

  @Post()
  envoyer(@Body() dto: SendMessageDto, @Request() req: any) {
    return this.service.envoyer(dto, req.user.id);
  }

  @Get('reception')
  reception(@Request() req: any) {
    return this.service.getBoiteReception(req.user.id);
  }

  @Get('envoi')
  envoi(@Request() req: any) {
    return this.service.getBoiteEnvoi(req.user.id);
  }

  @Get('conversation/:conversationId')
  conversation(@Param('conversationId') conversationId: string) {
    return this.service.getConversation(conversationId);
  }

  @Get('non-lus')
  countNonLus(@Request() req: any) {
    return this.service.countNonLus(req.user.id);
  }

  @Patch(':id/lire')
  marquerLu(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.marquerLu(id, req.user.id);
  }
}
