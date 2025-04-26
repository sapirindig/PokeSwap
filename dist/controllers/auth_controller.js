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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const users_model_1 = __importDefault(require("../models/users_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield users_model_1.default.create({
            email: email,
            password: hashedPassword,
            username: username,
        });
        const tokens = generateToken(user._id.toString());
        if (!tokens) {
            return res.status(500).send('Server Error: Token generation failed');
        }
        res.status(200).send({
            user: user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const generateToken = (userId) => {
    const tokenSecret = process.env.TOKEN_SECRET;
    const tokenExpires = process.env.TOKEN_EXPIRES;
    const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES;
    if (!tokenSecret || !tokenExpires || !refreshExpires) {
        console.error('Missing environment variables');
        return null;
    }
    const random = Math.random().toString();
    const accessToken = jsonwebtoken_1.default.sign({ _id: userId, random }, tokenSecret, { expiresIn: tokenExpires });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: userId, random }, tokenSecret, { expiresIn: refreshExpires });
    return {
        accessToken,
        refreshToken
    };
};
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }
        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }
        // generate token
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id
        });
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).send('Missing idToken');
        }
        const ticket = yield client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).send('Invalid Google payload');
        }
        let user = yield users_model_1.default.findOne({ email: payload.email });
        if (!user) {
            user = yield users_model_1.default.create({
                username: payload.name || payload.email.split('@')[0],
                email: payload.email,
                password: Math.random().toString(36),
            });
        }
        const tokens = generateToken(user._id.toString());
        if (!tokens) {
            return res.status(500).send('Token generation failed');
        }
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id
        });
    }
    catch (err) {
        console.error('Google login error:', err);
        res.status(400).send('Google login failed');
    }
});
const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        //get refresh token from body
        if (!refreshToken) {
            reject("fail");
            return;
        }
        //verify token
        if (!process.env.TOKEN_SECRET) {
            reject("fail");
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                reject("fail");
                return;
            }
            //get the user id fromn token
            const userId = payload._id;
            try {
                //get the user form the db
                const user = yield users_model_1.default.findById(userId);
                if (!user) {
                    reject("fail");
                    return;
                }
                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    yield user.save();
                    reject("fail");
                    return;
                }
                const tokens = user.refreshToken.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;
                resolve(user);
            }
            catch (err) {
                reject("fail");
                return;
            }
        }));
    });
};
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyRefreshToken(req.body.refreshToken);
        yield user.save();
        res.status(200).send("success");
    }
    catch (err) {
        res.status(400).send("fail");
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        yield user.save();
        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id
        });
        //send new token
    }
    catch (err) {
        res.status(400).send("fail");
    }
});
const authMiddleware = (req, res, next) => {
    console.log("Checking authMiddleware...");
    const authorization = req.header("authorization");
    console.log("Raw Authorization header:", authorization);
    const token = authorization && authorization.split(" ")[1];
    console.log("Extracted token:", token);
    if (!token) {
        console.log("No token found in Authorization header");
        return res.status(401).send("Access Denied");
    }
    if (!process.env.TOKEN_SECRET) {
        console.log("Missing TOKEN_SECRET in env");
        return res.status(500).send("Server Error");
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            console.log("Invalid token:", err.message);
            return res.status(401).send("Access Denied");
        }
        const userId = payload._id;
        console.log("Token valid - userId:", userId);
        req.params.userId = userId;
        next();
    });
};
exports.authMiddleware = authMiddleware;
exports.default = {
    register,
    login,
    refresh,
    logout,
    googleLogin
};
