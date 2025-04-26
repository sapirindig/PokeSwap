import { Request, Response, NextFunction } from 'express';
import userModel, { IUser } from '../models/users_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Document } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';


const register = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, password, username } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
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
    } catch (err) {
        res.status(400).send(err);
    }
};

type tTokens = {
    accessToken: string,
    refreshToken: string
}

const generateToken = (userId: string): tTokens | null => {
    const tokenSecret = process.env.TOKEN_SECRET;
    const tokenExpires = process.env.TOKEN_EXPIRES;
    const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES;

    if (!tokenSecret || !tokenExpires || !refreshExpires) {
        console.error('Missing environment variables');
        return null;
    }

    const random = Math.random().toString();

    const accessToken = jwt.sign(
        { _id: userId, random },
        tokenSecret,
        { expiresIn: tokenExpires } as SignOptions
    );
    
    const refreshToken = jwt.sign(
        { _id: userId, random },
        tokenSecret,
        { expiresIn: refreshExpires } as SignOptions
    );

    return {
        accessToken,
        refreshToken
    };
};

const login = async (req: Request, res: Response) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
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
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });

    } catch (err) {
        res.status(400).send(err);
    }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req: Request, res: Response) => {
    try {
      const { idToken, access_token } = req.body;
  
      if (!access_token) {
        return res.status(400).send('Missing access_token');
      }
  
      const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
  
      const payload = await userInfoResponse.json();
  
      if (!payload || !payload.email) {
        return res.status(400).send('Invalid Google payload');
      }
  
      let user = await userModel.findOne({ email: payload.email });
      if (!user) {
        user = await userModel.create({
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
  
    } catch (err) {
      console.error('Google login error:', err);
      res.status(400).send('Google login failed');
    }
  };

  

type tUser = Document<unknown, {}, IUser> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}
const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
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
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                return
            }
            //get the user id fromn token
            const userId = payload._id;
            try {
                //get the user form the db
                const user = await userModel.findById(userId);
                if (!user) {
                    reject("fail");
                    return;
                }
                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    await user.save();
                    reject("fail");
                    return;
                }
                const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;

                resolve(user);
            } catch (err) {
                reject("fail");
                return;
            }
        });
    });
}

const logout = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        await user.save();
        res.status(200).send("success");
    } catch (err) {
        res.status(400).send("fail");
    }
};

const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
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
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });
        //send new token
    } catch (err) {
        res.status(400).send("fail");
    }
};

type Payload = {
    _id: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            console.log("Invalid token:", err.message);
            return res.status(401).send("Access Denied");
        }

        const userId = (payload as any)._id;
        console.log("Token valid - userId:", userId);
        req.params.userId = userId;
        next();
    });
};

const me = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.findById(userId).select('username email');
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.status(200).send({
        username: user.username,
        email: user.email
      });
    } catch (err) {
      res.status(500).send('Server Error');
    }
  };
  

export default {
    register,
    login,
    refresh,
    logout,
    googleLogin,
    me
};