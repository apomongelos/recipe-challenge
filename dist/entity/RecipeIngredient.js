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
exports.RecipeIngredient = void 0;
const typeorm_1 = require("typeorm");
const Ingredient_1 = require("./Ingredient");
const Recipe_1 = require("./Recipe");
let RecipeIngredient = class RecipeIngredient extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.Index(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], RecipeIngredient.prototype, "ingredientId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Ingredient_1.Ingredient, (ingredient) => ingredient.recipes),
    typeorm_1.JoinColumn({ name: 'ingredientId' }),
    __metadata("design:type", Ingredient_1.Ingredient)
], RecipeIngredient.prototype, "ingredient", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], RecipeIngredient.prototype, "recipeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Recipe_1.Recipe, (recipe) => recipe.ingredients),
    typeorm_1.JoinColumn({ name: 'recipeId' }),
    __metadata("design:type", Recipe_1.Recipe)
], RecipeIngredient.prototype, "recipe", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], RecipeIngredient.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], RecipeIngredient.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn(),
    __metadata("design:type", Date)
], RecipeIngredient.prototype, "deletedAt", void 0);
RecipeIngredient = __decorate([
    typeorm_1.Entity()
], RecipeIngredient);
exports.RecipeIngredient = RecipeIngredient;
