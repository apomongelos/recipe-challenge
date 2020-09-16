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
exports.IngredientCreateInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const IsIngredientAlreadyExist_1 = require("./IsIngredientAlreadyExist");
let IngredientCreateInput = class IngredientCreateInput {
};
__decorate([
    type_graphql_1.Field(),
    class_validator_1.Length(1, 255, { message: 'Nombre debe ser mayor a un caracter.' }),
    IsIngredientAlreadyExist_1.IsIngredientAlreadyExist({
        message: 'Ingrediente ya creado, elija otro nombre',
    }),
    __metadata("design:type", String)
], IngredientCreateInput.prototype, "name", void 0);
IngredientCreateInput = __decorate([
    type_graphql_1.InputType()
], IngredientCreateInput);
exports.IngredientCreateInput = IngredientCreateInput;