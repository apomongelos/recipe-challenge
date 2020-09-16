"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const dotEnv = __importStar(require("dotenv"));
const dataloader_1 = __importDefault(require("dataloader"));
const UserResolver_1 = require("./resolvers/UserResolver");
const RecipeResolver_1 = require("./resolvers/RecipeResolver");
const CategoryResolver_1 = require("./resolvers/CategoryResolver");
const IngredientResolver_1 = require("./resolvers/IngredientResolver");
const verifyUser_1 = require("./context/verifyUser");
const userLoader_1 = require("./loaders/userLoader");
const categoryLoader_1 = require("./loaders/categoryLoader");
const ingredientLoader_1 = require("./loaders/ingredientLoader");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = dotEnv.config();
        const app = express_1.default();
        const connection = yield typeorm_1.createConnection();
        const apolloServer = new apollo_server_express_1.ApolloServer({
            schema: yield type_graphql_1.buildSchema({
                resolvers: [
                    UserResolver_1.UserResolver,
                    CategoryResolver_1.CategoryResolver,
                    RecipeResolver_1.RecipeResolver,
                    IngredientResolver_1.IngredientResolver,
                ],
            }),
            context: ({ req }) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let contextObj = { email: '', loggedInUserId: '', loaders: {} };
                    if (req) {
                        yield verifyUser_1.verifyUser(req);
                        contextObj.email = req.email;
                        contextObj.loggedInUserId = req.loggedInUserId;
                    }
                    contextObj.loaders = {
                        user: new dataloader_1.default((keys) => userLoader_1.batchUsers(keys)),
                        category: new dataloader_1.default((keys) => categoryLoader_1.batchCategory(keys)),
                        ingredient: new dataloader_1.default((keys) => ingredientLoader_1.batchIngredient(keys)),
                    };
                    return contextObj;
                }
                catch (error) {
                    throw error;
                }
            }),
        });
        // cors
        app.use(cors_1.default());
        // middleware
        app.use(express_1.default.json());
        apolloServer.applyMiddleware({ app, path: '/graphql' });
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Server listening on PORT: ${PORT}`);
            console.log(`Graphql Endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
        });
    }
    catch (error) {
        throw error;
    }
}))();
