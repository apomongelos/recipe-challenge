"use strict";
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
exports.batchIngredient = void 0;
const typeorm_1 = require("typeorm");
const RecipeIngredient_1 = require("../entity/RecipeIngredient");
exports.batchIngredient = (recipeIds) => __awaiter(void 0, void 0, void 0, function* () {
    const ingredientsRecipe = yield RecipeIngredient_1.RecipeIngredient.find({
        join: {
            alias: 'recipeI',
            innerJoinAndSelect: {
                ingredient: 'recipeI.ingredient',
            },
        },
        where: {
            recipeId: typeorm_1.In(recipeIds),
        },
    });
    const recipeIdToIngredient = {};
    ingredientsRecipe.forEach((ir) => {
        if (ir.recipeId in recipeIdToIngredient) {
            recipeIdToIngredient[ir.recipeId].push(ir.ingredient);
        }
        else {
            recipeIdToIngredient[ir.recipeId] = [ir.ingredient];
        }
    });
    return recipeIds.map((recipeId) => recipeIdToIngredient[recipeId]);
});
