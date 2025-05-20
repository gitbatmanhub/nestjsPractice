import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserDto, LoginUserDto, ResponseAuthDto } from './dto';
import { AuthService } from './auth.service';
import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { User } from './entities/user.entity';
import { GetUserGraphQL } from './decorators/get-user.decorator';
import { Auth } from './decorators';

@Resolver()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => ResponseAuthDto)
  async login(@Args('loginUserDto') loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }

  @Mutation(() => ResponseAuthDto)
  async register(@Args('registerUserDto') createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Query(() => ResponseAuthDto)
  @Auth()
  async checkAthStatus(@GetUserGraphQL() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello GraphQL';
  }
}
