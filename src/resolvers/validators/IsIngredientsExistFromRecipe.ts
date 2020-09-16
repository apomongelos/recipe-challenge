import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Ingredient } from '../../entity/Ingredient';

@ValidatorConstraint({ async: true })
export class IsIngredientsExistFromRecipeConstraint
  implements ValidatorConstraintInterface {
  validate(ids: [number]) {
    return Ingredient.createQueryBuilder('ingredient')
      .where('ingredient.id IN (:...recipesId)', {
        recipesId: ids,
      })
      .getMany()
      .then((ingredients) => {
        if (ingredients.length === ids.length) return true;
        return false;
      });
  }
}

export function IsIngredientsExistFromRecipe(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIngredientsExistFromRecipeConstraint,
    });
  };
}
