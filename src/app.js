const express = require("express");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json({
    message: "Udyog backend",
  });
});
app.post("/register", async (req, res) => {
  const {
    ctl00$ContentPlaceHolder1$txtadharno: aadhaarNumber,
    ctl00$ContentPlaceHolder1$txtownername: ownerName,
    ctl00$ContentPlaceHolder1$ddltypeoforgn: orgType,
    ctl00$ContentPlaceHolder1$txtpan: panNumber,
  } = req.body;

  // Server-side validation
  if (!aadhaarNumber || !ownerName || !orgType || !panNumber) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Use Prisma to save the validated data to the database
    const newRegistration = await prisma.registration.create({
      data: {
        aadhaarNumber,
        ownerName,
        orgType,
        panNumber,
      },
    });

    // Send a success response back to the client
    res.status(201).json({
      message: "Registration successful!",
      data: newRegistration,
    });
  } catch (error) {
    console.error("Database Error:", error);
    // Handle specific errors, like if the Aadhaar/PAN already exists
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "A user with this Aadhaar or PAN already exists." });
    }
    res.status(500).json({ error: "Failed to save registration." });
  }
});

module.exports = app;
