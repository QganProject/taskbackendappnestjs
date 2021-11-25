import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    //when a class extends another class use super to initialize and provide some info
    super({
      // Signature to use in signing jwt token
      secretOrKey: configService.get('JWT_SECRET'), // Get signature key from env file
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // tells the strategy how to extract the token
    });
  }
  // what to do after knowing that the token is valid
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload; // grab the name of user who sent the payload
    const user: User = await this.usersRepository.findOne({ username }); // get info from database
    // the :User just specifies the type of the variable

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
