import { InputType, Field } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class UserLoginInput {
  @Field()
  @IsEmail({}, { message: 'Debe proporcionar un email.' })
  email: string;

  @Field()
  @Length(1, 255, { message: 'Contraseña debe ser mayor a un caracter.' })
  password: string;
}
