import request from "supertest";
import { app } from "../../index.js";

// npm run test --user.test.js
let token;
beforeEach(async () => {
  const { body } = await request(app).post("/users/login").send({
    email: "test@test.com",
    password: "123456asd",
  });
  token = body.token;
});

describe("Tests usuarios", () => {
  it("Codigo 200 en solicitud GET en ruta /users/user y validacion de Objeto con almenos un objeto", async () => {
    let { statusCode, body } = await request(app)
      .get("/users/user")
      .set("Authorization", `Bearer ${token}`);
    if (Object.keys(body).length <= 2) {
      body = "No existen objetos en la respuesta";
    }
    expect(statusCode).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });

  it("Codigo 404 al aplicar soft delete con PUT a ruta /users/user con un email inexistente", async () => {
    const { statusCode } = await request(app)
      .put(`/users/user`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "test@test.com",
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
      email: `test${random}@test.com`,
      password: "123456asd",
    };
    const { statusCode } = await request(app)
      .post("/users/register")
      .send(user);
    expect(statusCode).toBe(200);
  });

  it("Codigo 200 al generar token de usuario con POST a ruta /users/login", async () => {
    const user = { email: "test@test.com", password: "123456asd" };
    const { statusCode } = await request(app).post(`/users/login`).send(user);
    expect(statusCode).toBe(200);
  });
});
