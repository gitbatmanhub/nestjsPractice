import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginUserDto, ResponseLoginDto } from './dto';
import { AuthService } from './auth.service';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

@Resolver()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => ResponseLoginDto)
  async login(@Args('loginUserDto') loginUserDto: LoginUserDto) {
    const user = await this.authService.loginUser(loginUserDto);
    console.log(user);
    return user;
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello GraphQL';
  }
}
