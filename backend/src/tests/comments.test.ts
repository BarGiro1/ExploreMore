import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_models"; // משמש לאיפוס ה-DB
import { Express } from "express";
import testCommentsRaw from "./test_Comments.json";
import { testuser } from "./auth.test"
import { login } from "./test_utils";

let app: Express;
let accessToken: string;
let userId: string;

interface Comments {
    _id?: string;
    userId: string;
    postId: string;
    content: string;
}

const testComments: Comments[] = testCommentsRaw as Comments[];
const createdComments: Comments[] = []; // נשמור כאן את הפוסטים עם ה-_id שנוצרו

beforeAll(async () => {
    console.log("beforeAll");
    console.log('testuser', testuser);
    app = await appInit();
    [accessToken, userId] = await login(app);
    await commentsModel.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Comments Test", () => {
test("Test get all Comments initially (must specify post)", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(400);
});
test("Test create new Comments", async () => {
    for (let i = 0; i < testComments.length; i++) {
        const response = await request(app).post("/comments").set({authorization: accessToken}).send(testComments[i]);
        expect(response.statusCode).toBe(201);
        expect(response.body.userId).toBe(userId);
        expect(response.body.postId).toBe(testComments[i].postId);
        expect(response.body.content).toBe(testComments[i].content);
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
        
        //  Save created comment to `createdComments[]` with `_id`
        createdComments.push({ ...testComments[i], _id: response.body._id });
    }
    
    console.log(" Created Comments Array:", createdComments);
});

test("test get all comments by post id", async () => {
    const commentsToGet = createdComments[0]; // לוקחים פוסט עם _id מהמערך החדש
    const response = await request(app).get("/comments?postId=" + commentsToGet.postId)
    expect(response.statusCode).toBe(200);
    expect(response.body[0]._id).toBe(commentsToGet._id);
});

test ("test update comments", async () => {
    const commentsToUpdate = createdComments[0];
    const response = await request(app).put("/comments/" + commentsToUpdate._id).set({authorization: accessToken}).send({ content: "updated content" });
    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe("updated content");
});
test("test delete comments", async () => {
    const commentsToDelete = createdComments[0]; // לוקחים תגובה עם _id מהמערך החדש
    const response = await request(app).delete("/comments/" + commentsToDelete._id).set({authorization: accessToken});
    
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(commentsToDelete._id); // בדיקה שהשרת מחזיר את ה-_id שנמחק
});

}
);







  