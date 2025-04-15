import { expect } from "chai";
import { describe, it, before, after } from "mocha";
import supertest from "supertest";
import mongoose from "mongoose";
import { CONFIG } from "../config/config.js";

const requester = supertest("http://localhost:8081");

mongoose.connect(CONFIG.MONGO.URL)
  .then(() => console.log("🟢 Conectado a la base de datos de testing"))
  .catch((err) => {
    console.error("🔴 Error al conectar a la base de datos de testing:", err);
    process.exit(1);
  });

let testUser = null;

describe("Tests funcionales - router users", function () {
  this.timeout(10000);

  before(async () => {
    const { body: genRes } = await requester
      .post("/api/mocks/generateData")
      .send({ users: 1, pets: 0 }); // Para que no falle por body incompleto

    console.log("🧪 Respuesta de generateData:", genRes);

    if (!genRes.payload || !Array.isArray(genRes.payload.users) || genRes.payload.users.length === 0) {
      throw new Error("El endpoint /api/mocks/generateData no devolvió usuarios válidos");
    }

    testUser = genRes.payload.users[0];
    if (!testUser._id) throw new Error("Usuario generado sin _id");
  });

  after(async () => {
    if (testUser?._id) {
      await mongoose.connection.collection("users").deleteOne({ _id: new mongoose.Types.ObjectId(testUser._id) });
    }
    await mongoose.disconnect();
    console.log("🧹 Conexión cerrada correctamente");
  });

  it("GET /api/users debe retornar todos los usuarios", async () => {
    const { body, statusCode } = await requester.get("/api/users");

    expect(statusCode).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.payload).to.be.an("array");
  });

  it("GET /api/users/:uid debe retornar un usuario específico", async () => {
    const { body, statusCode } = await requester.get(`/api/users/${testUser._id}`);

    expect(statusCode).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.payload).to.have.property("_id", testUser._id);
  });

  it("GET /api/users/:uid con ID inexistente debe fallar", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const { body, statusCode } = await requester.get(`/api/users/${fakeUserId}`);

    expect([404, 400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("GET /api/users/:uid con ID malformado debe fallar", async () => {
    const { body, statusCode } = await requester.get("/api/users/notAValidId");

    expect([400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("PUT /api/users/:uid debe actualizar el usuario", async () => {
    const updateData = {
      first_name: "Updated",
      last_name: "User",
      role: "admin"
    };

    const { body, statusCode } = await requester.put(`/api/users/${testUser._id}`).send(updateData);

    expect(statusCode).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.payload.first_name).to.equal("Updated");
  });

  it("PUT /api/users/:uid con ID inexistente debe fallar", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const { body, statusCode } = await requester.put(`/api/users/${fakeUserId}`).send({ first_name: "Fail" });

    expect([404, 400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("DELETE /api/users/:uid debe eliminar el usuario", async () => {
    const { body, statusCode } = await requester.delete(`/api/users/${testUser._id}`);

    expect(statusCode).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.message).to.equal("User deleted");
    testUser = null; // usuario ya fue eliminado
  });

  it("DELETE /api/users/:uid con ID inexistente debe fallar", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const { body, statusCode } = await requester.delete(`/api/users/${fakeUserId}`);

    expect([404, 400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("DELETE /api/users/:uid con ID malformado debe fallar", async () => {
    const { body, statusCode } = await requester.delete("/api/users/notAValidId");

    expect([400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });
});
