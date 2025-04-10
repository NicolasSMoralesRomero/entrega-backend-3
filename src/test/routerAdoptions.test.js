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
let testPet = null;
let createdAdoptionId = null;

describe("Tests funcionales - router adoption", function () {
  this.timeout(10000);

  before(async () => {
    const { body: genRes } = await requester.post("/api/mocks/generateData").send({ users: 1, pets: 1 });

    console.log("🧪 Respuesta de generateData:", genRes);

    if (
      !genRes.payload ||
      !Array.isArray(genRes.payload.users) ||
      !Array.isArray(genRes.payload.pets) ||
      genRes.payload.users.length === 0 ||
      genRes.payload.pets.length === 0
    ) {
      throw new Error("El endpoint /api/mocks/generateData no devolvió datos válidos");
    }

    testUser = genRes.payload.users[0];
    testPet = genRes.payload.pets[0];

    if (!testUser._id || !testPet._id) {
      throw new Error("Datos de prueba inválidos: faltan _id");
    }

    if (testPet.adopted) {
      throw new Error("La mascota generada ya está adoptada. Asegurate que mockingService genere pets con 'adopted: false'");
    }
  });

  after(async () => {
    if (testUser?._id)
      await mongoose.connection.collection("users").deleteOne({ _id: new mongoose.Types.ObjectId(testUser._id) });
    if (testPet?._id)
      await mongoose.connection.collection("pets").deleteOne({ _id: new mongoose.Types.ObjectId(testPet._id) });
    await mongoose.connection.collection("adoptions").deleteMany({});
    await mongoose.disconnect();
    console.log("🧹 Conexión cerrada correctamente");
  });

  it("POST /api/adoptions/:uid/:pid debe registrar una adopción correctamente", async () => {
    const { body, statusCode } = await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);

    expect(statusCode).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.message).to.equal("Pet adopted successfully");
    expect(body.payload).to.have.property("_id");

    createdAdoptionId = body.payload._id;
  });

  it("GET /api/adoptions debe retornar todas las adopciones", async () => {
    const { body, statusCode } = await requester.get("/api/adoptions");

    expect(statusCode).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.payload).to.be.an("array");
  });

  it("GET /api/adoptions/:aid debe retornar una adopción específica", async () => {
    expect(createdAdoptionId).to.not.be.null;

    const { body, statusCode } = await requester.get(`/api/adoptions/${createdAdoptionId}`);

    expect(statusCode).to.equal(200);
    expect(body.status).to.equal("success");
    expect(body.payload).to.have.property("owner");
    expect(body.payload).to.have.property("pet");
  });

  it("POST /api/adoptions/:uid/:pid con mascota ya adoptada debe fallar", async () => {
    const { body, statusCode } = await requester.post(`/api/adoptions/${testUser._id}/${testPet._id}`);

    expect([400, 409, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("POST /api/adoptions/:uid/:pid con usuario inexistente debe fallar", async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const { body, statusCode } = await requester.post(`/api/adoptions/${fakeUserId}/${testPet._id}`);

    expect([404, 400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("POST /api/adoptions/:uid/:pid con mascota inexistente debe fallar", async () => {
    const fakePetId = new mongoose.Types.ObjectId();
    const { body, statusCode } = await requester.post(`/api/adoptions/${testUser._id}/${fakePetId}`);

    expect([404, 400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("POST /api/adoptions/:uid/:pid con IDs malformados debe fallar", async () => {
    const { body, statusCode } = await requester.post(`/api/adoptions/invalidUserId/invalidPetId`);

    expect([400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("GET /api/adoptions/:aid con ID inexistente debe retornar 404 o error", async () => {
    const fakeAdoptionId = new mongoose.Types.ObjectId();
    const { body, statusCode } = await requester.get(`/api/adoptions/${fakeAdoptionId}`);

    expect([404, 400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });

  it("GET /api/adoptions/:aid con ID malformado debe retornar error", async () => {
    const { body, statusCode } = await requester.get("/api/adoptions/notAValidId");

    expect([400, 500]).to.include(statusCode);
    expect(body).to.have.property("error");
  });
});