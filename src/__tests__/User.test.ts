

import request from 'supertest';
import { app } from '../app';
import { getConnection } from 'typeorm';

import createConnection from '../database'

describe("User" , () => {

    beforeAll(async () => {
        const Connection = await createConnection();
        await Connection.runMigrations();
    })

    
    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
      });


   it("Should be able to create a new User", async () => {

    const response = await request(app).post("/users")
    .send({
        email: "username@oi.com.br",
        name : "douglas ed"
    });

    expect(response.status).toBe(201);

   });


   it("Should not be able to create a new User with existing email", async () => {

    const response = await request(app).post("/users")
    .send({
        email: "username@oi.com.br",
        name : "douglas ed"
    });

    expect(response.status).toBe(400);

   })
    
});