import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rvgbnuedurcnwzodpdci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2JudWVkdXJjbnd6b2RwZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTg0MTEsImV4cCI6MjA0NzgzNDQxMX0.BBy7eipkQdAHNcZttlglerWdW1yrTwwgKBc52Eym-7w"
);

// Create a new lead
export const createLead = async (req, res) => {
  try {
    const {
      name,
      contactNo,
      email,
      city,
      userId,
      budget,
      lookingFor,
      preferredLocation,
      preferredTiming,
    } = req.body; // Include the new fields

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert([
        {
          name,
          contact_no: contactNo,
          email,
          city,
          user_id: userId, // Assign userId to the lead
          budget, // Insert budget
          lookingFor: lookingFor, // Insert lookingFor
          preferedLocation: preferredLocation, // Insert preferredLocation
          preferedTiming: preferredTiming, // Insert preferredTiming
        },
      ])
      .single();

    if (leadError) {
      return res
        .status(500)
        .json({ message: "Error creating lead", error: leadError });
    }

    return res.status(201).json({ message: "Lead created successfully", lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating lead", error });
  }
};

// Get all leads
// Get all leads (no filtering by user_id)
export const getLeads = async (req, res) => {
  try {
    const { data: leads, error } = await supabase.from("leads").select("*"); // No user_id filter, fetch all leads

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching leads", error });
    }

    return res.status(200).json({ leads });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching leads", error });
  }
};

// Get a single lead by its ID
export const getLead = async (req, res) => {
  try {
    const { id } = req.params; // Getting the lead ID from the URL

    // Query the database using Supabase to fetch the lead by ID
    const { data: lead, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .maybeSingle(); // Will return null if no row is found

    console.log({ data: lead, error });
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching lead", error });
    }

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json({ lead });

    return res.status(200).json({ lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching lead", error });
  }
};

// Update lead details
// Update lead details
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactNo, email, city, status, remark } = req.body; // Include status and remark fields

    // Update lead details, including status and remark
    const { data: lead, error } = await supabase
      .from("leads")
      .update({
        name,
        contact_no: contactNo,
        email,
        city,
        status, // Update the status field
        remark, // Update the remark field
      })
      .eq("id", id) // Find the lead by ID
      .single();

    if (error || !lead) {
      return res
        .status(404)
        .json({ message: "Lead not found or error updating" });
    }

    return res.status(200).json({ message: "Lead updated successfully", lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating lead", error });
  }
};

// Get all leads for a specific user/client
export const getLeadsByClient = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameter

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch leads from the database that match the userId
    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId); // Filter leads by the userId

    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching leads", error });
    }

    if (!leads || leads.length === 0) {
      return res
        .status(404)
        .json({ message: "No leads found for this client." });
    }

    return res.status(200).json({ leads });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching leads", error });
  }
};

// Delete a lead by ID
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: lead, error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .single();

    if (error || !lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting lead", error });
  }
};
