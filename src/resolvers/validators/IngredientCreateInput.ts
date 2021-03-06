import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

import { IsIngredientAlreadyExist } from './IsIngredientAlreadyExist';

@InputType()
export class IngredientCreateInput {
  @Field()
  @Length(1, 255, { message: 'Nombre debe ser mayor a un caracter.' })
  @IsIngredientAlreadyExist({
    message: 'Ingrediente ya creado, elija otro nombre',
  })
  name: string;
}
