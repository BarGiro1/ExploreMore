import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import likesModel from "../models/likes_models"; // משמש לאיפוס ה-DB
import { Express } from "express";
import testLikesRaw from "./test_Likes.json";

let app: Express;


interface Likes {
    _id?: string;
    userId: string;
    postId: string;
}

const testLikes: Likes[] = testLikesRaw as Likes[];
const createdLikes: Likes[] = []; // נשמור כאן את הפוסטים עם ה-_id שנוצרו

beforeAll(async () => {
    console.log("beforeAll");
    app = await appInit();
    await likesModel.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Likes Test", () => {

test("Test create new Likes", async () => {
    for (let i = 0; i < testLikes.length; i++) {
        const response = await request(app).post("/likes").send(testLikes[i]);
        expect(response.statusCode).toBe(201);
        expect(response.body.userId).toBe(testLikes[i].userId);
        expect(response.body.postId).toBe(testLikes[i].postId);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
        
        //  Save created comment to `createdLikes[]` with `_id`
        createdLikes.push({ ...testLikes[i], _id: response.body._id });
    }
});


test("test get all likes by user id", async () => {
    const likesToGet = createdLikes[0]; // לוקחים פוסט עם _id מהמערך החדש
    const response = await request(app).get("/likes/user/" + likesToGet.userId);
    expect(response.statusCode).toBe(200);
    expect(response.body[0]._id).toBe(likesToGet._id);
});

test("test delete likes", async () => {
    const likesToDelete = createdLikes[0];
    const response = await request(app).delete("/likes/" + likesToDelete._id);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(likesToDelete._id);
});
}
);







  