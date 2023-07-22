import request from "supertest";
import { app } from "../index.js";

describe("Tests usuarios", () => {
  it("Codigo 200 en solicitud GET en ruta /users/user y validacion de Objeto con almenos un objeto", async () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZXJAZW1haWwuY29tIiwicGFzc3dvcmQiOiJ0ZXN0cGFzc3dvcmQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTAwMTI2MjF9.1_qLUHDUoFMGmn21Oc16lKGc1Q_H4Jfn2AwDEzZzPbI";
    let { statusCode, body } = await request(app)
      .get("/users/user")
      .set("Authorization", `Bearer ${jwt}`);
    if (Object.keys(body).length <= 2) {
      body = "No existen objetos en la respuesta";
    }
    expect(statusCode).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });

  it("Codigo 404 al aplicar soft delete con PUT a ruta /users/user con un email inexistente", async () => {
    const jwt =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0ZXJAZW1haWwuY29tIiwicGFzc3dvcmQiOiJ0ZXN0cGFzc3dvcmQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTAwMTI2MjF9.1_qLUHDUoFMGmn21Oc16lKGc1Q_H4Jfn2AwDEzZzPbI";
    const { statusCode } = await request(app)
      .put(`/users/user`)
      .set("Authorization", `Bearer ${jwt}`)
      .send({
        email: "tester@email.com",
        password: "testpassword",
        userToEdit: "usuario404@example.com",
        param: "active",
        newParam: "false",
      });
    expect(statusCode).toBe(404);
  });

  it("Codigo 200 al agregar un usuario con POST a ruta /users/register", async () => {
    const random = Math.floor(Math.random() * 999);
    const user = {
      email: `tester${random}@email.com`,
      password: "testpassword",
    };
    const { statusCode } = await request(app)
      .post("/users/register")
      .send(user);
    expect(statusCode).toBe(200);
  });

  it("Codigo 200 al generar token de usuario con POST a ruta /users/login", async () => {
    const user = { email: "tester@email.com", password: "testpassword" };
    const { statusCode } = await request(app).post(`/users/login`).send(user);
    expect(statusCode).toBe(200);
  });
});
