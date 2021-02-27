

import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

describe("Survey" , () => {

    beforeAll(async () => {
        const Connection = await createConnection();
        await Connection.runMigrations();
    })   
    
      afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
      });

   it("Should be able to create a new Survey", async () => {

    const response = await request(app).post("/surveys")
    .send({
        title: "Este é meu titulo",
        description : "Descrição do Título"
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

   });

    it("Should be able to get all surveys", async () => {

       await request(app).post("/surveys")
        .send({
            title: "Este é meu titulo 2",
            description : "Descrição do Título 2"
        });

        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2);
        
    })
    
});