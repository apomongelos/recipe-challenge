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
exports.RecipeUpdateInput = void 0;
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const IsCategoryExistFromRecipe_1 = require("./IsCategoryExistFromRecipe");
const IsIngredientsExistFromRecipe_1 = require("./IsIngredientsExistFromRecipe");
let RecipeUpdateInput = class RecipeUpdateInput {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.Length(1, 255, { message: 'Nombre debe ser mayor a un caracter.' }),
    __metadata("design:type", String)
], RecipeUpdateInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    class_validator_1.Length(1, 255, { message: 'Descripcion debe ser mayor a un caracter.' }),
    __metadata("design:type", String)
], RecipeUpdateInput.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.ID, { nullable: true }),
    IsCategoryExistFromRecipe_1.IsCategoryExistFromRecipe({
        message: 'Categoria no encontrada, verifique el id',
    }),
    __metadata("design:type", Number)
], RecipeUpdateInput.prototype, "categoryId", void 0);
__decorate([
    type_graphql_1.Field((type) => [type_graphql_1.ID], { nullable: true }),
    IsIngredientsExistFromRecipe_1.IsIngredientsExistFromRecipe({
        message: 'Uno o ningun ingrediente encontrado',
    }),
    __metadata("design:type", Array)
], RecipeUpdateInput.prototype, "ingredients", void 0);
RecipeUpdateInput = __decorate([
    type_graphql_1.InputType()
], RecipeUpdateInput);
exports.RecipeUpdateInput = RecipeUpdateInput;
