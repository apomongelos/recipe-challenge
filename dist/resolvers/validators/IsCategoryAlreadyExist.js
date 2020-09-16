"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsCategoryAlreadyExist = exports.IsCategoryAlreadyExistConstraint = void 0;
const class_validator_1 = require("class-validator");
const Category_1 = require("../../entity/Category");
let IsCategoryAlreadyExistConstraint = class IsCategoryAlreadyExistConstraint {
    validate(name) {
        return Category_1.Category.findOne({ where: { name }, withDeleted: true }).then((category) => {
            if (category)
                return false;
            return true;
        });
    }
};
IsCategoryAlreadyExistConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsCategoryAlreadyExistConstraint);
exports.IsCategoryAlreadyExistConstraint = IsCategoryAlreadyExistConstraint;
function IsCategoryAlreadyExist(validationOptions) {
    return function (object, propertyName) {
        class_validator_1.registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCategoryAlreadyExistConstraint,
        });
    };
}
exports.IsCategoryAlreadyExist = IsCategoryAlreadyExist;
