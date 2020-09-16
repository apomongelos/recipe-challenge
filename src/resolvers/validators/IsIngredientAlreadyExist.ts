import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Ingredient } from '../../entity/Ingredient';

@ValidatorConstraint({ async: true })
export class IsIngredientAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(name: string) {
    return Ingredient.findOne({ where: { name }, withDeleted: true }).then(
      (ingredient) => {
        if (ingredient) return false;
        return true;
      }
    );
  }
}

export function IsIngredientAlreadyExist(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsIngredientAlreadyExistConstraint,
    });
  };
}
