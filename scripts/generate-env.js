import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse .env file manually
function parseEnv(content) {
  const env = {};
  // Handle both Windows (CRLF) and Unix (LF) line endings
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  lines.forEach((line) => {
    // Skip empty lines and comments
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) return;

    const equalIndex = trimmedLine.indexOf("=");
    if (equalIndex > 0) {
      const key = trimmedLine.substring(0, equalIndex).trim();
      const value = trimmedLine.substring(equalIndex + 1).trim();
      env[key] = value;
    }
  });
  return env;
}

// Load .env file
const envPath = path.resolve(__dirname, "../.env");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = parseEnv(envContent);

// Generate env.js content
const envJsContent = `window.__ENV__ = {
  VITE_NOVA_SONDAGEM_API: "${env.VITE_NOVA_SONDAGEM_API || ""}",
  VITE_NOVA_SONDAGEM_VERSAO: "${env.VITE_NOVA_SONDAGEM_VERSAO || ""}",
  VITE_SGP_API: "${env.VITE_SGP_API || ""}"
};
`;

// Write to public/env.js
const outputPath = path.resolve(__dirname, "../public/env.js");
fs.writeFileSync(outputPath, envJsContent);
