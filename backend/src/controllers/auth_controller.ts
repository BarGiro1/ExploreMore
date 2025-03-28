import { NextFunction, Request, Response } from 'express';
import userModel, { IUser } from '../models/users_models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document, Types } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();


const googleSignin = async (req: Request, res: Response) => {
    const credential = req.body.credential;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log(payload);
        const email = payload?.email;
        if (email != null) {
            let user = await userModel.findOne({ email: email });
            if (user == null) {
                user = await userModel.create({
                    email: email,
                    password: new Types.ObjectId().toHexString(),
                    username: email
                });
            }
            const tokens = generateToken(user._id.toString());
            if (!tokens) {
                res.status(500).send('Server Error');
                return;
            }
            res.status(200).send({
                _id: user._id,
                email: user.email,
                ...tokens
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(400).send("error missing email or password");
    }
 }

const register = async (req: Request, res: Response) => {
    try {
        console.log('Register user', req.body);
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userModel.create({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            imageUrl: req.body.imageUrl
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

type tTokens = {
    accessToken: string,
    refreshToken: string
}

const generateToken = (userId: string): tTokens | null => {
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
        throw new Error("TOKEN_SECRET is not defined");
    }

    // generate token
    const random = Math.random().toString();
    const accessToken = jwt.sign({ _id: userId }, secret, { expiresIn: '3d' });

    const refreshToken = jwt.sign({ _id: userId, random }, secret, { expiresIn: '7d' });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};

const login = async (req: Request, res: Response) => {
    console.log('login', req.body);
    try {
        const user = await userModel.findOne({ username: req.body.username });
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
        const tokens = generateToken(user._id.toString());
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        console.debug('login success', tokens);
        console.log('Logged in', user);
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

type tUser = Document<unknown, {}, IUser> & IUser & Required<{
    _id: string;    
}> & {
    __v: number;
}
const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {
        //get refresh token from body
        if (!refreshToken) {
            reject("fail2");
            return;
        }
        //verify token
        if (!process.env.TOKEN_SECRET) {
            reject("fail3");
            return;
        }
        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("fail4");
                return
            }
            //get the user id fromn token
            const userId = payload._id;
            try {
                //get the user form the db
                const user = await userModel.findById(userId);
                if (!user) {
                    reject("fail5");
                    return;
                }
                if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
                    user.refreshToken = [];
                    await user.save();
                    reject("fail6");
                    return;
                }
                const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;
                resolve(user);
            } catch (err) {
                reject("fai7");
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
        res.status(400).send(err);
    }
};

const refresh = async (req: Request, res: Response) => {
    try {
        console.log('refresh', req.body.refreshToken)
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail1");
            return;
        }
        const tokens = generateToken(user._id.toString());

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
        res.status(400).send(err);
    }
};

type Payload = {
    _id: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']
    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
        req.params.userId = (payload as Payload)._id;
        next();
    });
};

export default {
    googleSignin,
    register,
    login,
    refresh,
    logout
};