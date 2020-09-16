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
exports.isRecipeOwner = void 0;
const Recipe_1 = require("../entity/Recipe");
exports.isRecipeOwner = ({ context, args }, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipe = yield Recipe_1.Recipe.findOneOrFail({ where: { id: args.id } });
        if (recipe.userId !== context.loggedInUserId) {
            throw new Error('No esta autorizado para dicha accion');
        }
        return next();
    }
    catch (error) {
        throw error;
    }
});
