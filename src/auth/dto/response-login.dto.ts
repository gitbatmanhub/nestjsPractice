import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ResponseLoginDto {
  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  token: string;

  constructor(fullName: string, email: string, token: string) {
    this.fullName = fullName;
    this.email = email;
    this.token = token;
  }
}
