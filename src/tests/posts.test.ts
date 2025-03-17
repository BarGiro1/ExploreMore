import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_models"; // משמש לאיפוס ה-DB
import { Express } from "express";
import testPostsRaw from "./test_Posts.json";

let app: Express;

// ממשק Post כדי לוודא תאימות
interface Post {
    _id?: string;
    title: string;
    content: string;
    owner: string;
}

const testPosts: Post[] = testPostsRaw as Post[];
const createdPosts: Post[] = []; // נשמור כאן את הפוסטים עם ה-_id שנוצרו

beforeAll(async () => {
    console.log("beforeAll");
    app = await appInit();
    await postModel.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Posts Test", () => {
    test("Test get all posts initially (should be empty)", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });

    test("Test create new posts", async () => {
        for (let i = 0; i < testPosts.length; i++) {
            const response = await request(app).post("/posts").send(testPosts[i]);
            expect(response.statusCode).toBe(201);
            expect(response.body.title).toBe(testPosts[i].title);
            expect(response.body.content).toBe(testPosts[i].content);
            expect(response.body.owner).toBe(testPosts[i].owner);
            expect(response.body.numOfComments).toBe(0);
            expect(response.body.numOfLikes).toBe(0);
            expect(response.body.createdAt).toBeDefined();
            expect(response.body.updatedAt).toBeDefined();
            

            // שמירת הפוסט שנוצר עם ה-_id שהתקבל מהשרת
            console.log(response.body);
            createdPosts.push({ ...testPosts[i], _id: response.body._id });
        }
    });

    test("Test get all posts after creating them", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(createdPosts.length);
    });

    test("Test get post by id", async () => {
        const postToGet = createdPosts[0]; // לוקחים פוסט עם _id מהמערך החדש
        const response = await request(app).get("/posts/" + postToGet._id);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postToGet._id);
    });

    test("Test filter by owner", async () => {
        const response = await request(app).get("/posts?owner=" + createdPosts[0].owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });

    test("Test Delete post", async () => {
        const postToDelete = createdPosts[0]; // לוקחים פוסט עם _id מהמערך החדש
        const response = await request(app).delete("/posts/" + postToDelete._id);
        expect(response.statusCode).toBe(200);

        const response2 = await request(app).get("/posts/" + postToDelete._id);
        expect(response2.statusCode).toBe(404);
    });

    test("Test Create Post Fail", async () => {
        const response = await request(app).post("/posts").send({ title: "title" });
        expect(response.statusCode).toBe(400);
    });
});
