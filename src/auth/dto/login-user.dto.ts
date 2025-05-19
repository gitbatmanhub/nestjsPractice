import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  @IsString()
  password: string;
}
