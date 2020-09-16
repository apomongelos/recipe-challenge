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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Ingredient_1 = require("../entity/Ingredient");
const Recipe_1 = require("../entity/Recipe");
const RecipeIngredient_1 = require("../entity/RecipeIngredient");
const isAuth_1 = require("../middleware/isAuth");
const IngredientCreateInput_1 = require("./validators/IngredientCreateInput");
const IngredientUpdateInput_1 = require("./validators/IngredientUpdateInput");
let IngredientResolver = class IngredientResolver {
    getIngredients() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Ingredient_1.Ingredient.find();
        });
    }
    getOneIngredient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ingredient = yield Ingredient_1.Ingredient.findOne({ id: id });
                if (!ingredient)
                    throw new Error('Ingrediente no encontrado');
                return ingredient;
            }
            catch (error) {
                return error;
            }
        });
    }
    createIngredient(newIngredientData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newIngredient = yield Ingredient_1.Ingredient.create(Object.assign({}, newIngredientData)).save();
                return newIngredient;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateIngredient(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Ingredient_1.Ingredient.update({ id }, input);
                const updatedIngredient = yield Ingredient_1.Ingredient.findOne({ id: id });
                return updatedIngredient;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteIngredient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ingredient = yield Ingredient_1.Ingredient.findOne(id);
                if (!ingredient)
                    throw new Error('No encontrado');
                const ingredientSoftRemove = yield Ingredient_1.Ingredient.softRemove(ingredient);
                const recipes = yield RecipeIngredient_1.RecipeIngredient.find({
                    ingredientId: ingredientSoftRemove.id,
                });
                recipes.forEach((recipe) => __awaiter(this, void 0, void 0, function* () {
                    const result = yield RecipeIngredient_1.RecipeIngredient.find({
                        where: { recipeId: recipe.recipeId },
                    });
                    if (Object.keys(result).length === 1) {
                        const eliminatedRecipe = yield Recipe_1.Recipe.find({
                            where: { id: recipe.recipeId },
                        });
                        yield Recipe_1.Recipe.softRemove(eliminatedRecipe);
                    }
                }));
                const recipesSoftRemove = yield RecipeIngredient_1.RecipeIngredient.softRemove(recipes);
                return ingredientSoftRemove;
            }
            catch (error) {
                return error;
            }
        });
    }
    restoreIngredient(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ingredient = yield Ingredient_1.Ingredient.findOne({ id: id }, { withDeleted: true });
                if (!ingredient)
                    throw new Error('No encontrado');
                const entySoftRestore = yield Ingredient_1.Ingredient.update({ id }, { deletedAt: 'null' });
                const recipes = yield RecipeIngredient_1.RecipeIngredient.find({
                    where: { ingredientId: ingredient.id },
                    withDeleted: true,
                });
                recipes.forEach((recipe) => __awaiter(this, void 0, void 0, function* () {
                    const recipeIngredientCreated = yield RecipeIngredient_1.RecipeIngredient.update({ ingredientId: ingredient.id }, { deletedAt: 'null' });
                    const result = yield RecipeIngredient_1.RecipeIngredient.find({
                        where: { recipeId: recipe.recipeId },
                    });
                    if (Object.keys(result).length === 1) {
                        const updateRecipe = yield Recipe_1.Recipe.update({ id: recipe.recipeId }, { deletedAt: 'null' });
                    }
                }));
                return ingredient;
            }
            catch (error) {
                return error;
            }
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => [Ingredient_1.Ingredient]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IngredientResolver.prototype, "getIngredients", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => Ingredient_1.Ingredient),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IngredientResolver.prototype, "getOneIngredient", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Ingredient_1.Ingredient),
    __param(0, type_graphql_1.Arg('input', () => IngredientCreateInput_1.IngredientCreateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IngredientCreateInput_1.IngredientCreateInput]),
    __metadata("design:returntype", Promise)
], IngredientResolver.prototype, "createIngredient", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Ingredient_1.Ingredient),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('input', () => IngredientUpdateInput_1.IngredientUpdateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, IngredientUpdateInput_1.IngredientUpdateInput]),
    __metadata("design:returntype", Promise)
], IngredientResolver.prototype, "updateIngredient", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Ingredient_1.Ingredient),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IngredientResolver.prototype, "deleteIngredient", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Ingredient_1.Ingredient),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IngredientResolver.prototype, "restoreIngredient", null);
IngredientResolver = __decorate([
    type_graphql_1.Resolver()
], IngredientResolver);
exports.IngredientResolver = IngredientResolver;
