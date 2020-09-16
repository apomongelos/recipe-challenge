import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Category } from '../../entity/Category';
@ValidatorConstraint({ async: true })
export class IsCategoryAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(name: string) {
    return Category.findOne({ where: { name }, withDeleted: true }).then(
      (category) => {
        if (category) return false;
        return true;
      }
    );
  }
}

export function IsCategoryAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCategoryAlreadyExistConstraint,
    });
  };
}
