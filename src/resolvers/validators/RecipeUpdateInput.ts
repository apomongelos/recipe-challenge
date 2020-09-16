import { InputType, Field, ID } from 'type-graphql';
import { Length } from 'class-validator';

import { IsCategoryExistFromRecipe } from './IsCategoryExistFromRecipe';
import { IsIngredientsExistFromRecipe } from './IsIngredientsExistFromRecipe';

@InputType()
export class RecipeUpdateInput {
  @Field({ nullable: true })
  @Length(1, 255, { message: 'Nombre debe ser mayor a un caracter.' })
  name?: string;

  @Field({ nullable: true })
  @Length(1, 255, { message: 'Descripcion debe ser mayor a un caracter.' })
  description?: string;

  @Field((type) => ID, { nullable: true })
  @IsCategoryExistFromRecipe({
    message: 'Categoria no encontrada, verifique el id',
  })
  categoryId?: number;

  @Field((type) => [ID], { nullable: true })
  @IsIngredientsExistFromRecipe({
    message: 'Uno o ningun ingrediente encontrado',
  })
  ingredients?: number[];
}
