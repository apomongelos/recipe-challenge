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
exports.CategoryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../entity/Category");
const Recipe_1 = require("../entity/Recipe");
const isAuth_1 = require("../middleware/isAuth");
const CategoryCreateInput_1 = require("./validators/CategoryCreateInput");
const CategoryUpdateInput_1 = require("./validators/CategoryUpdateInput");
let CategoryResolver = class CategoryResolver {
    getCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category_1.Category.find();
        });
    }
    getOneCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield Category_1.Category.findOne({ id: id });
                if (!category)
                    throw new Error('Categoria no encontrada');
                return category;
            }
            catch (error) {
                return error;
            }
        });
    }
    createCategory(newCategoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCategory = yield Category_1.Category.create(newCategoryData).save();
                return newCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateCategory(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Category_1.Category.update({ id }, input);
                const updatedCategory = yield Category_1.Category.findOne({ id: id });
                return updatedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoria = yield Category_1.Category.findOne(id);
                if (!categoria)
                    throw new Error('No encontrado');
                const categoriaSoftRemove = yield Category_1.Category.softRemove(categoria);
                const recipes = yield Recipe_1.Recipe.find({ categoryId: categoriaSoftRemove.id });
                const recipesSoftRemove = yield Recipe_1.Recipe.softRemove(recipes);
                return categoriaSoftRemove;
            }
            catch (error) {
                return error;
            }
        });
    }
    restoreCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoria = yield Category_1.Category.findOne({ id: id }, { withDeleted: true });
                if (!categoria)
                    throw new Error('No encontrado');
                const entySoftRestore = yield Category_1.Category.update({ id }, { deletedAt: 'null' });
                const recipes = yield Recipe_1.Recipe.find({ category: categoria });
                const recipesSoftRemove = yield Recipe_1.Recipe.update({ category: categoria }, { deletedAt: 'null' });
                return categoria;
            }
            catch (error) {
                return error;
            }
        });
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => [Category_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getCategories", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => Category_1.Category),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "getOneCategory", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Category_1.Category),
    __param(0, type_graphql_1.Arg('input', () => CategoryCreateInput_1.CategoryCreateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryCreateInput_1.CategoryCreateInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "createCategory", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Category_1.Category),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __param(1, type_graphql_1.Arg('input', () => CategoryUpdateInput_1.CategoryUpdateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CategoryUpdateInput_1.CategoryUpdateInput]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "updateCategory", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Category_1.Category),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "deleteCategory", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Category_1.Category),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryResolver.prototype, "restoreCategory", null);
CategoryResolver = __decorate([
    type_graphql_1.Resolver()
], CategoryResolver);
exports.CategoryResolver = CategoryResolver;
