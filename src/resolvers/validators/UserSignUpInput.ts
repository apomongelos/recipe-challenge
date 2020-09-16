import { InputType, Field } from 'type-graphql';
import { Length, IsEmail, Matches } from 'class-validator';
import { IsEmailAlreadyExist } from './IsEmailAlreadyExist';

@InputType()
export class UserSignUpInput {
  @Field()
  @Length(1, 255, { message: 'Nombre debe ser mayor a un caracter.' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Debe proporcionar un email.' })
  @IsEmailAlreadyExist({ message: 'Email ya esta en uso' })
  email: string;

  @Field()
  @Length(5, 255, {
    message: 'Contraseña corta, debe ser mayor a 5 caracteres',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, {
    message: 'Contraseña insegura, incluya mayusculas, minusculas y numeros',
  })
  password: string;
}
