import { IsOptional, IsString } from 'class-validator';

export class NewMessageDto {
  @IsOptional()
  id: string;
  @IsString()
  message: string;
}
