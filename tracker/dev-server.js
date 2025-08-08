const { exec } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3002;
const DIST_DIR = path.join(__dirname, "dist");

// Function to build the tracker
function buildTracker() {
  console.log("🔨 Building tracker...");
  exec("npm run build -- --mode development", (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Build failed:", error);
      return;
    }
    const filePath = path.join(DIST_DIR, "hp.js");
    if (fs.existsSync(filePath)) {
      console.log(
        "✅ Build completed with a size of",
        (fs.statSync(filePath).size / 1024).toFixed(2),
        "KB"
      );
    } else {
      console.log("✅ Build completed but file not found");
    }
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve the tracker file
  if (req.url === "/heatpeek-tracker.js" || req.url === "/") {
    const filePath = path.join(DIST_DIR, "hp.js");

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/javascript");
      res.setHeader("Cache-Control", "no-cache");
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Tracker not built yet. Please wait...");
    }
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

// Start server
server.listen(PORT, () => {
  console.log(
    `🚀 Tracker development server running at http://localhost:${PORT}`
  );
  console.log(
    `📄 Your tracker is available at: http://localhost:${PORT}/heatpeek-tracker.js`
  );
  console.log("👀 Watching for changes... (Press Ctrl+C to stop)");

  // Initial build
  buildTracker();

  // Watch for changes in src directory
  const srcDir = path.join(__dirname, "src");
  fs.watch(srcDir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      console.log(`📝 File changed: ${filename}`);
      buildTracker();
    }
  });
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down development server...");
  server.close(() => {
    process.exit(0);
  });
});
