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
exports.Recipe = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Category_1 = require("./Category");
const Ingredient_1 = require("./Ingredient");
const User_1 = require("./User");
const RecipeIngredient_1 = require("./RecipeIngredient");
let Recipe = class Recipe extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field((type) => type_graphql_1.ID),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Recipe.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Recipe.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Recipe.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field((type) => Category_1.Category, { name: 'category' }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Recipe.prototype, "categoryId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => Category_1.Category, (category) => category.recipes, {
        nullable: false,
        cascade: true,
    }),
    typeorm_1.JoinColumn({ name: 'categoryId' }),
    __metadata("design:type", Category_1.Category)
], Recipe.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field((type) => User_1.User, { name: 'user' }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Recipe.prototype, "userId", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => User_1.User, (user) => user.recipes, {
        nullable: false,
        cascade: true,
    }),
    typeorm_1.JoinColumn({ name: 'userId' }),
    __metadata("design:type", User_1.User)
], Recipe.prototype, "user", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Recipe.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Recipe.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.DeleteDateColumn(),
    __metadata("design:type", Date)
], Recipe.prototype, "deletedAt", void 0);
__decorate([
    type_graphql_1.Field((type) => [Ingredient_1.Ingredient]),
    typeorm_1.OneToMany(() => RecipeIngredient_1.RecipeIngredient, (recipeIngredient) => recipeIngredient.recipe),
    __metadata("design:type", Array)
], Recipe.prototype, "ingredients", void 0);
Recipe = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Recipe);
exports.Recipe = Recipe;
