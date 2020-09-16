"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsIngredientsExistFromRecipe = exports.IsIngredientsExistFromRecipeConstraint = void 0;
const class_validator_1 = require("class-validator");
const Ingredient_1 = require("../../entity/Ingredient");
let IsIngredientsExistFromRecipeConstraint = class IsIngredientsExistFromRecipeConstraint {
    validate(ids) {
        return Ingredient_1.Ingredient.createQueryBuilder('ingredient')
            .where('ingredient.id IN (:...recipesId)', {
            recipesId: ids,
        })
            .getMany()
            .then((ingredients) => {
            if (ingredients.length === ids.length)
                return true;
            return false;
        });
    }
};
IsIngredientsExistFromRecipeConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsIngredientsExistFromRecipeConstraint);
exports.IsIngredientsExistFromRecipeConstraint = IsIngredientsExistFromRecipeConstraint;
function IsIngredientsExistFromRecipe(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsIngredientsExistFromRecipeConstraint,
        });
    };
}
exports.IsIngredientsExistFromRecipe = IsIngredientsExistFromRecipe;
