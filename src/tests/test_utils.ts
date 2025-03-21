import request from "supertest";
import userDetails from "./user_details.json";
import express,{Express} from 'express';


const login = async (app: Express) => {
    await register(app);
    const response = await request(app).post("/auth/login").send(userDetails);
    return [response.body.accessToken, response.body._id];
}

const register = (app: Express) => {
    return request(app).post("/auth/register").send(userDetails);
}


export { login, register };