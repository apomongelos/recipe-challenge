"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsIngredientAlreadyExist = exports.IsIngredientAlreadyExistConstraint = void 0;
const class_validator_1 = require("class-validator");
const Ingredient_1 = require("../../entity/Ingredient");
let IsIngredientAlreadyExistConstraint = class IsIngredientAlreadyExistConstraint {
    validate(name) {
        return Ingredient_1.Ingredient.findOne({ where: { name }, withDeleted: true }).then((ingredient) => {
            if (ingredient)
                return false;
            return true;
        });
    }
};
IsIngredientAlreadyExistConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsIngredientAlreadyExistConstraint);
exports.IsIngredientAlreadyExistConstraint = IsIngredientAlreadyExistConstraint;
function IsIngredientAlreadyExist(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsIngredientAlreadyExistConstraint,
        });
    };
}
exports.IsIngredientAlreadyExist = IsIngredientAlreadyExist;
