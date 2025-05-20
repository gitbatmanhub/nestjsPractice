import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import {
  Auth,
  GetUser,
  HeadersUserDecorator,
  RoleProtected,
} from './decorators';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Credentials already exist',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error occurred',
  })
  @Post('register')
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.createUser(createAuthDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credentials incorrect or not found',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
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

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private3')
  @Auth()
  @UseGuards(AuthGuard(), UserRoleGuard)
  private3Route(@GetUser() user: User) {
    return { ok: true, user: user };
  }
}
