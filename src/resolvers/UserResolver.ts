import * as bcrypt from 'bcryptjs';
import {
  Resolver,
  Field,
  Mutation,
  Arg,
  ObjectType,
} from 'type-graphql';
import * as jwt from 'jsonwebtoken';

import { User } from '../entity/User';
import { UserSignUpInput } from './validators/UserSignUpInput';
import { UserLoginInput } from './validators/UserLoginInput';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg('input', () => UserLoginInput) { email, password }: UserLoginInput
  ): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error('Email o contraseña invalido');

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error('Email o contraseña invalido');

      const accessToken = jwt.sign(
        { email: user.email },
        process.env.APIKEY || 'mysecretkey',
        { expiresIn: '6h' }
      );

      return { accessToken: accessToken };
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => User)
  async signUp(
    @Arg('input', () => UserSignUpInput) newUserData: UserSignUpInput
  ): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(newUserData.password, 12);
      const newUser = await User.create({
        ...newUserData,
        password: hashedPassword,
      }).save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
