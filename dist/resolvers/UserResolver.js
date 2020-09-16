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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.UserResolver = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const type_graphql_1 = require("type-graphql");
const jwt = __importStar(require("jsonwebtoken"));
const User_1 = require("../entity/User");
const UserSignUpInput_1 = require("./validators/UserSignUpInput");
const UserLoginInput_1 = require("./validators/UserLoginInput");
let LoginResponse = class LoginResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
let UserResolver = class UserResolver {
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne({ where: { email } });
                if (!user)
                    throw new Error('Email o contraseña invalido');
                const validPassword = yield bcrypt.compare(password, user.password);
                if (!validPassword)
                    throw new Error('Email o contraseña invalido');
                const accessToken = jwt.sign({ email: user.email }, process.env.APIKEY || 'mysecretkey', { expiresIn: '6h' });
                return { accessToken: accessToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
    signUp(newUserData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield bcrypt.hash(newUserData.password, 12);
                const newUser = yield User_1.User.create(Object.assign(Object.assign({}, newUserData), { password: hashedPassword })).save();
                return newUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
};
__decorate([
    type_graphql_1.Mutation(() => LoginResponse),
    __param(0, type_graphql_1.Arg('input', () => UserLoginInput_1.UserLoginInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserLoginInput_1.UserLoginInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => User_1.User),
    __param(0, type_graphql_1.Arg('input', () => UserSignUpInput_1.UserSignUpInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserSignUpInput_1.UserSignUpInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "signUp", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
