import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  import { Category } from '../../entity/Category';
  
  @ValidatorConstraint({ async: true })
  export class IsCategoryExistFromRecipeConstraint
    implements ValidatorConstraintInterface {
    validate(id: number) {
      return Category.findOne({ where: { id } }).then((category) => {
        if (category) return true;
        return false;
      });
    }
  }
  
  export function IsCategoryExistFromRecipe(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsCategoryExistFromRecipeConstraint,
      });
    };
  }
  