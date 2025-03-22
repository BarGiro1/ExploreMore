import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
    console.log("beforeAll");
    app = await appInit();
});


afterAll(async () => {
    await mongoose.connection.close();
});

describe("File Tests", () => {
    test("upload file", async () => {
      const filePath = `${__dirname}/avatar.png`;
      
      console.log("filePath: " + filePath);
      try {
        const response = await request(app)
          .post("/files").attach('file', filePath)
        expect(response.statusCode).toEqual(200);

        console.log("response.body.url: " + response.body.url);

        let url = response.body.url;
        url = url.replace(/^.*\/\/[^/]+/, '')
        const res = await request(app).get(url)
        expect(res.statusCode).toEqual(200);
      } catch (err) {
        console.log(err);
        expect(1).toEqual(2);
      }
    })
})