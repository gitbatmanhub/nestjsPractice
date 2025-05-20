import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserDto {
  @ApiProperty({
    description: 'Email address',
  })
  @IsString()
  @Field()
  email: string;

  @ApiProperty({
    description: 'Password',
  })
  @Field()
  @IsString()
  password: string;
}
