// Repository files access the database it is good practice to put your create users or
// Functions that write data into the database in this file
//It is also a goood practice to use async methods when accessing database

import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    //Using Bcrypt to hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // console.log(
    //   `salt: ${salt} on ${password} SaltedPassword: ${hashedPassword}`,
    // );

    const user = this.create({
      username,
      password: hashedPassword,
    });
    // course solution for handling duplicate erros
    // try {
    //   await this.save(user);
    // } catch (error) {
    //   if (error.code === '23505') {
    //     //duplcate username error
    //     throw new ConflictException('Username Already Exists');
    //   } else {
    //     throw new InternalServerErrorException();
    //   }
    // }
    await this.save(user);
  }
}
