import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  //When accessing a database create a constructor which refers to the repository file
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    // Good practice to handle duplicate or errors before they reach the database
    const { username } = authCredentialsDto;
    const duplicateUser = await this.usersRepository.findOne({
      username,
    });
    if (duplicateUser) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      return this.usersRepository.createUser(authCredentialsDto);
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
      // Standard Practice Return a jwt as object
    } else {
      throw new UnauthorizedException('Please Check your Credentials');
    }
  }
}
