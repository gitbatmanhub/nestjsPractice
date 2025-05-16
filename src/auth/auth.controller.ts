import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { HeadersUserDecorator } from './decorators/headers-user.decorator';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @HeadersUserDecorator() headers: [],
  ) {
    return {
      ok: true,
      message: `Welcome to JwtStrategy!`,
      user: user,
      email: 'email',
      headers: headers,
    };
  }

  @Get('private2')
  // @SetMetadata('roles', ['super-user', 'admin'])
  @RoleProtected(ValidRoles.superAdmin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  private2Route(@GetUser() user: User) {
    return { ok: true, user: user };
  }

  @Get('private3')
  // @SetMetadata('roles', ['super-user', 'admin'])
  @RoleProtected(ValidRoles.superAdmin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  private3Route(@GetUser() user: User) {
    return { ok: true, user: user };
  }
}
