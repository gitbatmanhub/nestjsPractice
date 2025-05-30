import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto, ResponseAuthDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createAuthDto: CreateUserDto) {
    try {
      const { password, ...userData } = createAuthDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return this.plainResponseUser(user, this.getJwtToken({ id: user.id }));
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { fullName: true, email: true, password: true, id: true },
      });

      if (!user) {
        throw new UnauthorizedException('Credentials not found');
      }

      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Password incorrect');
      }

      return this.plainResponseUser(user, this.getJwtToken({ id: user.id }));
    } catch (error) {
      this.handleDbError(error);
    }
  }

  checkAuthStatus(user: User) {
    return this.plainResponseUser(user, this.getJwtToken({ id: user.id }));
  }

  async plainResponseUser(user: User, token: string) {
    const { email, fullName } = user;
    return new ResponseAuthDto(fullName, email, token);
  }

  private handleDbError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException(error.message);
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
