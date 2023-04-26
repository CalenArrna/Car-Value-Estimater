import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Authentication System - E2E", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("handle sign up request", () => {
    const testMail = "unique2@email.com";
    return request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: testMail, password: "testPassword" })
      .expect(201)
      .then((response) => {
        const { id, email } = response.body;
        expect(id).toBeDefined();
        expect(email).toEqual(testMail);
      });
  });

  it("should sign up as a new user and should be able to get the current user", async function() {
    const testMail = "user@email.com";
    const res = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({ email: testMail, password: "123" })
      .expect(201);

    const cookie = res.get("Set-Cookie");

    const { body } = await request(app.getHttpServer())
      .get("/auth/whoami")
      .set("Cookie", cookie)
      .expect(200);

    expect(body.email).toEqual(testMail);
  });

});