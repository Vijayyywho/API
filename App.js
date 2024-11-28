import express from "express";
import axios from "axios";
import querystring from "querystring"; // To format the request body for ClickUp API
import cors from "cors";
import leadRoutes from "./Routes/leadRoute.js";
import clientRoutes from "./Routes/ClientRoutes.js";
import authRoutes from "./Routes/authRoute.js"; // Correct path to your route

const app = express();

// Enable CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Client Routes
app.use("/api", clientRoutes);

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api", leadRoutes); // All lead-related routes will start with /api

// ClickUp OAuth token exchange endpoint
app.post("/api/exchange-clickup-code", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  // Hardcoding the ClickUp credentials directly in the code
  const CLICKUP_CLIENT_ID = "M90Y7JDKC2EQYET6HZPOZMLVTKOV4YN1";
  const CLICKUP_CLIENT_SECRET =
    "DWW3BNZDTPJQY4GHVJ8O5M5WP4BOIGZ1SEXCWHTWL4QQYFTUKGC2XOQNA8ZHLAW2";
  const CLICKUP_REDIRECT_URI = "http://localhost:5173/dashboard"; // Use the redirect URI you've set in ClickUp

  const data = querystring.stringify({
    client_id: CLICKUP_CLIENT_ID,
    client_secret: CLICKUP_CLIENT_SECRET,
    code: code,
    redirect_uri: CLICKUP_REDIRECT_URI, // URI you configured in ClickUp
  });

  try {
    const response = await axios.post(
      "https://api.clickup.com/api/v2/oauth/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    // Successful response, handle access_token
    return res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response ? error.response.data : error
    );
    return res
      .status(500)
      .json({ error: "Failed to exchange code for access token" });
  }
});

// Root Route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
