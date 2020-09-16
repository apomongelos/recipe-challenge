"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryUpdateInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const IsCategoryAlreadyExist_1 = require("./IsCategoryAlreadyExist");
let CategoryUpdateInput = class CategoryUpdateInput {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    class_validator_1.Length(1, 255, { message: 'Nombre debe ser mayor a un caracter.' }),
    IsCategoryAlreadyExist_1.IsCategoryAlreadyExist({ message: 'Categoria ya creada, elija otro nombre' }),
    __metadata("design:type", String)
], CategoryUpdateInput.prototype, "name", void 0);
CategoryUpdateInput = __decorate([
    type_graphql_1.InputType()
], CategoryUpdateInput);
exports.CategoryUpdateInput = CategoryUpdateInput;
