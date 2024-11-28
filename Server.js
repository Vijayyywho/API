require("dotenv").config(); // This loads the environment variables from your .env file

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");

const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const app = express();
const port = 5000;

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/clients", upload.single("photo"), async (req, res) => {
  try {
    const { name, email, contactNo, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let photoUrl = null;

    if (req.file) {
      photoUrl = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        contactNo,
        password: hashedPassword,
        photoUrl,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Failed to create client" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
