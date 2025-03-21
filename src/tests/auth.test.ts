import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser } from "../models/users_models";

var app: Express;


beforeAll(async () => {
    app = await appInit();
    await userModel.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

const baseUrl = "/auth";

const testuser = { 
    accessToken: "",
    refreshToken: "",
    _id: "",
    username: "bar",
    password: "1234",
    email: "BAR@GMAIL.COM"
};


describe("Auth Test", () => {
    test("Auth test register", async () => {
        const response = await request(app).post(baseUrl + "/register").send(testuser);
        expect(response.statusCode).toBe(200);
    });

    test("Auth test login", async () => {
        const response = await request(app).post(baseUrl + "/login").send(testuser);
        expect(response.statusCode).toBe(200);
        testuser.accessToken = response.body.accessToken;
        testuser.refreshToken = response.body.refreshToken;
         const userId = response.body._id;

        expect(testuser.accessToken).toBeDefined();
        expect(userId).toBeDefined();
        testuser.accessToken = testuser.accessToken;
        testuser._id=userId;
    });

    test("Auth test login fail", async () => {
        const response = await request(app).post(baseUrl + "/login").send({ email: testuser.email, password: "12345" });
        expect(response.statusCode).toBe(400);
    });

    test("Auth test protected API", async () => {
        console.log(testuser.accessToken)
        const response = await request(app).post("/posts").set(
            'authorization', 'Bad Access token'
            ).send({
            title: "Test Post",
            content: "Test Content",
            owner: "feds",
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post("/posts").set(
            'authorization', testuser.accessToken
            ).send({
            title: "Test Post",
            content: "Test Content",
            owner: "feds",
        });
        expect(response2.statusCode).toBe(201);
    });

    test("Get protected API invallid token", async () => {
        const response = await request(app).get("/posts").set(
            'authorization', 'Bad Access token'
            ).send(
            { title: "Test Post", content: "Test Content", owner: testuser._id }

        );
        expect(response.statusCode).not.toBe(201);

      
    });

    test("refresh token", async () => {
        const response = await request(app).post(baseUrl + "/refresh").send({ refreshToken: testuser.refreshToken });
        expect(response.statusCode).toBe(200);
        testuser.refreshToken = response.body.refreshToken
    });

    test("logout", async () => {
        const response = await request(app).post(baseUrl + "/logout").send({ refreshToken: testuser.refreshToken });
        expect(response.statusCode).toBe(200);
    }
    );
});
