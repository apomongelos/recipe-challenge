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
exports.RecipeResolver = exports.FilterSearch = void 0;
const type_graphql_1 = require("type-graphql");
const Recipe_1 = require("../entity/Recipe");
const Ingredient_1 = require("../entity/Ingredient");
const Category_1 = require("../entity/Category");
const User_1 = require("../entity/User");
const RecipeIngredient_1 = require("../entity/RecipeIngredient");
const RecipeCreateInput_1 = require("./validators/RecipeCreateInput");
const RecipeUpdateInput_1 = require("./validators/RecipeUpdateInput");
const isAuth_1 = require("../middleware/isAuth");
const isRecipeOwner_1 = require("../middleware/isRecipeOwner");
let FilterSearch = class FilterSearch {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], FilterSearch.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], FilterSearch.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], FilterSearch.prototype, "ingredient", void 0);
FilterSearch = __decorate([
    type_graphql_1.InputType()
], FilterSearch);
exports.FilterSearch = FilterSearch;
let RecipeResolver = class RecipeResolver {
    ingredients(parent, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ctx.loaders.ingredient.load(Number(parent.id));
            }
            catch (error) {
                throw error;
            }
        });
    }
    category(parent, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ctx.loaders.category.load(Number(parent.categoryId));
            }
            catch (error) {
                throw error;
            }
        });
    }
    user(parent, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return ctx.loaders.user.load(Number(parent.userId));
            }
            catch (error) {
                throw error;
            }
        });
    }
    getRecipes(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof filters !== 'undefined') {
                    if (Object.keys(filters).length > 1) {
                        throw new Error('Solo puede filtrar por un campo');
                    }
                    if (filters.name) {
                        return yield Recipe_1.Recipe.find({ where: { name: filters.name } });
                    }
                    if (filters.category) {
                        return yield Recipe_1.Recipe.find({
                            join: {
                                alias: 'recipeI',
                                innerJoin: {
                                    category: 'recipeI.category',
                                },
                            },
                            where: (qb) => {
                                qb.where('category.name = :categoryName', {
                                    categoryName: filters.category,
                                });
                            },
                        });
                    }
                    if (filters.ingredient) {
                        return yield Recipe_1.Recipe.createQueryBuilder('recipe')
                            .innerJoinAndSelect(RecipeIngredient_1.RecipeIngredient, 'recipe_ingredient', 'recipe.id = recipe_ingredient.recipeId')
                            .innerJoinAndSelect(Ingredient_1.Ingredient, 'ingredient', 'recipe_ingredient.ingredientId = ingredient.id')
                            .where('ingredient.name = :name', { name: filters.ingredient })
                            .getMany();
                    }
                }
                return yield Recipe_1.Recipe.find();
            }
            catch (error) {
                throw error;
            }
        });
    }
    getOneRecipe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe = yield Recipe_1.Recipe.findOne({ where: { id: id } });
                if (!recipe)
                    throw new Error('Recipe no encontrada');
                return recipe;
            }
            catch (error) {
                return error;
            }
        });
    }
    getMyRecipes(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipes = yield Recipe_1.Recipe.find({
                where: { userId: ctx.loggedInUserId },
            });
            return recipes;
        });
    }
    createRecipe({ name, description, categoryId, ingredients }, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipeCreated = yield Recipe_1.Recipe.create({
                    name: name,
                    description: description,
                    categoryId: categoryId,
                    userId: ctx.loggedInUserId,
                }).save();
                for (let index = 0; index < ingredients.length; index++) {
                    yield RecipeIngredient_1.RecipeIngredient.create({
                        ingredientId: ingredients[index],
                        recipeId: recipeCreated.id,
                    }).save();
                }
                return recipeCreated;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateRecipe(id, { name, description, categoryId, ingredients }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (name) {
                    const recipeNameUpdated = yield Recipe_1.Recipe.update({ id }, { name: name });
                }
                if (description) {
                    const recipeDescriptionUpdated = yield Recipe_1.Recipe.update({ id }, { description: description });
                }
                if (categoryId) {
                    const recipeCategoryUpdated = yield Recipe_1.Recipe.update({ id }, { categoryId: categoryId });
                }
                if (ingredients) {
                    ingredients.forEach((ingredient) => __awaiter(this, void 0, void 0, function* () {
                        const recipeIngredientCreated = yield RecipeIngredient_1.RecipeIngredient.update({ recipeId: id }, { ingredientId: ingredient });
                    }));
                }
                const updatedIngredient = yield Recipe_1.Recipe.findOne({ id: id });
                return updatedIngredient;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRecipe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe = yield Recipe_1.Recipe.findOne(id);
                if (!recipe)
                    throw new Error('No encontrado');
                const recipeSoftRemove = yield Recipe_1.Recipe.softRemove(recipe);
                const ingredients = yield RecipeIngredient_1.RecipeIngredient.find({
                    recipeId: recipeSoftRemove.id,
                });
                const recipesSoftRemove = yield RecipeIngredient_1.RecipeIngredient.softRemove(ingredients);
                return recipeSoftRemove;
            }
            catch (error) {
                throw error;
            }
        });
    }
    restoreRecipe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipe = yield Recipe_1.Recipe.findOne({ id: id }, { withDeleted: true });
                if (!recipe)
                    throw new Error('No encontrado');
                const entySoftRestore = yield Recipe_1.Recipe.update({ id }, { deletedAt: 'null' });
                const ingredients = yield RecipeIngredient_1.RecipeIngredient.find({
                    where: { recipeId: recipe.id },
                    withDeleted: true,
                });
                if (ingredients) {
                    ingredients.forEach((ingredient) => __awaiter(this, void 0, void 0, function* () {
                        const recipeIngredientCreated = yield RecipeIngredient_1.RecipeIngredient.update({ recipeId: id }, { deletedAt: 'null' });
                    }));
                }
                return recipe;
            }
            catch (error) {
                return error;
            }
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => [Ingredient_1.Ingredient]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Recipe_1.Recipe, Object]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "ingredients", null);
__decorate([
    type_graphql_1.FieldResolver(() => Category_1.Category),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Recipe_1.Recipe, Object]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "category", null);
__decorate([
    type_graphql_1.FieldResolver(() => User_1.User),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Recipe_1.Recipe, Object]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "user", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => [Recipe_1.Recipe]),
    __param(0, type_graphql_1.Arg('filter', () => FilterSearch, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterSearch]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getRecipes", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => Recipe_1.Recipe),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getOneRecipe", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => [Recipe_1.Recipe]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getMyRecipes", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Recipe_1.Recipe),
    __param(0, type_graphql_1.Arg('input', () => RecipeCreateInput_1.RecipeCreateInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecipeCreateInput_1.RecipeCreateInput, Object]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "createRecipe", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth, isRecipeOwner_1.isRecipeOwner),
    type_graphql_1.Mutation(() => Recipe_1.Recipe, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('input', () => RecipeUpdateInput_1.RecipeUpdateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, RecipeUpdateInput_1.RecipeUpdateInput]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "updateRecipe", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth, isRecipeOwner_1.isRecipeOwner),
    type_graphql_1.Mutation(() => Recipe_1.Recipe),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "deleteRecipe", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Recipe_1.Recipe),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "restoreRecipe", null);
RecipeResolver = __decorate([
    type_graphql_1.Resolver(Recipe_1.Recipe)
], RecipeResolver);
exports.RecipeResolver = RecipeResolver;
