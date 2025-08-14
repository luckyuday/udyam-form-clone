import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest"; // This is the supertest library
import app from "./app"; // We import the app object we just exported
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("POST register", () => {
  // Clean up the database before and after the tests
  beforeAll(async () => {
    await prisma.registration.deleteMany({});
  });

  afterAll(async () => {
    await prisma.registration.deleteMany({});
    await prisma.$disconnect();
  });

  it("should create a new registration with valid data", async () => {
    const validData = {
      ctl00$ContentPlaceHolder1$txtadharno: "123456789012",
      ctl00$ContentPlaceHolder1$txtownername: "Test User",
      ctl00$ContentPlaceHolder1$ddltypeoforgn: "1",
      ctl00$ContentPlaceHolder1$txtpan: "ABCDE1234F",
    };

    const response = await request(app).post("/register").send(validData);

    // Assert that the server responded with 201 Created
    expect(response.statusCode).toBe(201);
    // Assert that the response body contains the success message
    expect(response.body.message).toBe("Registration successful!");
    // Assert that the PAN number in the response data matches what we sent
    expect(response.body.data.panNumber).toBe(
      validData["ctl00$ContentPlaceHolder1$txtpan"]
    );
  });

  it("should return a 400 error if a field is missing", async () => {
    const invalidData = {
      ctl00$ContentPlaceHolder1$txtadharno: "123456789013",
      ctl00$ContentPlaceHolder1$txtownername: "Test User Missing Field",
      // Missing orgType and panNumber
    };

    const response = await request(app).post("/register").send(invalidData);

    // Assert that the server responded with 400 Bad Request
    expect(response.statusCode).toBe(400);
    // Assert that the response body contains the error message
    expect(response.body.error).toBe("Missing required fields.");
  });
});
