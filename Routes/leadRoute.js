import express from "express";
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  getLeadsByClient,
} from "../Controllers/leadControllers.js";

const router = express.Router();

// Route for creating a new lead
router.post("/leads", createLead);

// Route for getting all leads (filter by userId as a query parameter)
router.get("/leads", getLeads); // This route will use query parameters for filtering leads by userId

// Route for getting a single lead by ID
router.get("/leads/:id", getLead);

// Route for updating a lead
router.put("/leads/:id", updateLead);

// Route for deleting a lead
router.delete("/leads/:id", deleteLead);

router.get("/leads/clients/:userId", getLeadsByClient);

export default router;
