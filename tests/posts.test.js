const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const postModel = require("../models/posts_models"); // משמש לאיפוס ה-DB

const testPosts = require("./test_Posts");

beforeAll(async () => {
    console.log("beforeAll");
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
            testPosts[i]._id= response.body._id;
        }
    });

    
    test("Test get all posts after creating them", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(testPosts.length);
    });
    test ("Test get post by id", async () => {
        const response = await request(app).get("/posts/"+ testPosts[0]._id);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(testPosts[0]._id);
    }
    );
    test("Test filter by owner", async () => {
        const response = await request(app).get("/posts?owner=" + testPosts[0].owner);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });
    test("Test Delete post", async () => {
        const response = await request(app).delete("/posts/" + testPosts[0]._id);
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).get("/posts/"+ testPosts[0]._id);
        expect(response2.statusCode).toBe(404);
    });
});
