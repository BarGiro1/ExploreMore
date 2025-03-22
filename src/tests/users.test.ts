import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import usersModel from "../models/users_models"; // משמש לאיפוס ה-DB
import { Express } from "express";
import testusersRaw from "./test_users.json";
import { login } from "./test_utils";

let app: Express;
var refreshToken: string = "";
var userId: string = "";
 
 // ממשק Post כדי לוודא תאימות
 interface Users {
     _id?: string;
     username: string;
     email: string;
     password: string;
 }
 
 const testUsers: Users[] = testusersRaw as Users[];
 const createdUsers: Users[] = []; // נשמור כאן את היוזרים עם ה-_id שנוצרו
 
 beforeAll(async () => {
     console.log("beforeAll");
     app = await appInit();
     [refreshToken, userId] = await login(app);
     await usersModel.deleteMany();
 });
 
 afterAll(async () => {
     await mongoose.connection.close();
 });
 
 describe("Userss Test", () => {
     test("Test get all users initially (should be empty)", async () => {
         const response = await request(app).get("/users");
         expect(response.statusCode).toBe(200);
         expect(response.body.length).toBe(0);
     });
 
     test("Test create new users", async () => {
         for (let i = 0; i < testUsers.length; i++) {
             const response = await request(app).post("/users").set('authorization', refreshToken).send(testUsers[i]);
             expect(response.statusCode).toBe(201);
             expect(response.body.username).toBe(testUsers[i].username);
             expect(response.body.email).toBe(testUsers[i].email);
             expect(response.body.password).toBe(testUsers[i].password);
             expect(response.body.createdAt).toBeDefined();
             expect(response.body.updatedAt).toBeDefined();
             
 
             // שמירת הפוסט שנוצר עם ה-_id שהתקבל מהשרת
             createdUsers.push({ ...testUsers[i], _id: response.body._id });
         }
     });
 
     test("Test get all users after creating them", async () => {
         const response = await request(app).get("/users");
         expect(response.statusCode).toBe(200);
         expect(response.body.length).toBe(createdUsers.length);
     });
     test ("test create new user", async () => {
         for (let i = 0; i < testUsers.length; i++) {
             const response = await request(app).post("/users").set('authorization', refreshToken).send(testUsers[i]);
             expect(response.statusCode).toBe(201);
             expect(response.body.username).toBe(testUsers[i].username);
             expect(response.body.email).toBe(testUsers[i].email);
             expect(response.body.password).toBe(testUsers[i].password);
             expect(response.body.createdAt).toBeDefined();
             expect(response.body.updatedAt).toBeDefined();
     }} ) ;
     test ("Test get user by id", async () => {
         const userToGet = createdUsers[0]; // לוקחים פוסט עם _id מהמערך החדש
         const response = await request(app).get("/users/" + userToGet._id);
         expect(response.statusCode).toBe(200);
         expect(response.body._id).toBe(userToGet._id);
     }
 );
 test("Test update user", async () => {
         const userToUpdate = createdUsers[0]; // לוקחים פוסט עם _id מהמערך החדש
         const response = await request(app).put("/users").set('authorization', refreshToken).send({ username: "noa" });
         expect(response.statusCode).toBe(200);
         expect(response.body.username).toBe("noa");
     }
 
 );} );