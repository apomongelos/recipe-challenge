import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

import { IsCategoryAlreadyExist } from './IsCategoryAlreadyExist';

@InputType()
export class CategoryCreateInput {
  @Field()
  @Length(1, 255, { message: 'Nombre debe ser mayor a un caracter.' })
  @IsCategoryAlreadyExist({ message: 'Categoria ya creada, elija otro nombre' })
  name: string;
}
