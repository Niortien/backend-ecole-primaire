import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsInt()
  destinataireId!: number;

  @IsString()
  sujet!: string;

  @IsString()
  contenu!: string;

  @IsUUID()
  @IsOptional()
  conversationId?: string;
}
