import express from "express";
const router = express.Router();

import {
  getClients,
  createNewClient,
} from "../Controllers/Clientcontrollers.js";

// Route to create a new client
router.post("/clients", createNewClient);

// Route to get all clients
router.get("/clients", getClients);

router.get("/clients", async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.status(200).json(clients);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Unable to fetch clients" });
  }
});

export default router;
