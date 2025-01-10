const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS to allow requests from your VS Code extension
app.use(cors({ origin: "*" }));

// GitHub repository details
const GITHUB_REPO = "KOWSIK-M/vs-music-songs";
const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents`;
const RAW_BASE_URL = "https://raw.githubusercontent.com";

// API endpoint to get the songs list
app.get("/songs", async (req, res) => {
  try {
    const headers = {
      Authorization: `Bearer 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`,
    };
    const response = await axios.get(GITHUB_API_URL, { headers });

    const files = response.data;

    // Filter MP3 files and construct song objects
    const songs = files
      .filter((file) => file.name.endsWith(".mp3"))
      .map((file) => ({
        name: file.name.replace(".mp3", ""), // Remove file extension from name
        url: `${RAW_BASE_URL}/${GITHUB_REPO}/main/${file.name}`, // Construct raw URL
      }));

    res.json(songs);
  } catch (error) {
    console.error("Error fetching songs from GitHub:", error.message);
    res.status(500).json({ error: "Failed to fetch songs from GitHub" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
