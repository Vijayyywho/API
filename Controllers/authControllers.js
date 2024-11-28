import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  "https://rvgbnuedurcnwzodpdci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2JudWVkdXJjbnd6b2RwZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTg0MTEsImV4cCI6MjA0NzgzNDQxMX0.BBy7eipkQdAHNcZttlglerWdW1yrTwwgKBc52Eym-7w" // Your Supabase anon key
);

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists by email
    const { data: client, error } = await supabase
      .from("clients") // Replace with your actual table name
      .select("*")
      .eq("email", email) // Query by email
      .single();

    if (error || !client) {
      console.error("Error fetching client:", error);
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: client.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY, // Ensure JWT_SECRET_KEY is set in your .env file
      { expiresIn: "7d" } // Token expiration: 7 days
    );

    // Remove the password before sending the client info
    const { password: userPassword, ...clientInfo } = client;

    res.status(200).json({ ...clientInfo, token }); // Send user info and token
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Failed to login!" });
  }
};
