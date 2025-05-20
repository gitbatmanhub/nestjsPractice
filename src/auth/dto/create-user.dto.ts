import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  @Field()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'ThisIsTh3Str0ngPassword',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @Field()
  password: string;

  @ApiProperty({
    description: 'Full Name of the user',
    example: 'Mi Full Name',
  })
  @IsString()
  @MinLength(1)
  @Field()
  fullName: string;
}
