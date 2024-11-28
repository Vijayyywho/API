import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import multer from "multer";

const supabase = createClient(
  "https://rvgbnuedurcnwzodpdci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2JudWVkdXJjbnd6b2RwZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTg0MTEsImV4cCI6MjA0NzgzNDQxMX0.BBy7eipkQdAHNcZttlglerWdW1yrTwwgKBc52Eym-7w"
);

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
});

export const createNewClient = async (req, res) => {
  const { name, contactNo, email, password } = req.body;

  if (!name || !contactNo || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const { data: existingClient, error: fetchError } = await supabase
      .from("clients")
      .select("email")
      .eq("email", email)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking client existence:", fetchError);
      return res.status(500).json({ error: "Error checking client existence" });
    }

    if (existingClient) {
      return res
        .status(400)
        .json({ error: "Client with this email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: clientData, error: insertError } = await supabase
      .from("Client")
      .insert([
        {
          name,
          contactNo,
          email,
          password: hashedPassword,
        },
      ])
      .single();

    if (insertError) {
      console.error("Error inserting client:", insertError);
      return res.status(500).json({ error: "Error creating client" });
    }

    res.status(201).json(clientData);
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Error creating client" });
  }
};

export const getClients = async (req, res) => {
  try {
    const { data, error } = await supabase.from("clients").select();

    if (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({ error: "Unable to fetch clients" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Unable to fetch clients" });
  }
};
