// DealTruth local server: serves app/ at http://localhost:8080
// (pass --port <n> for another port). Static files only, no build step.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const port = Number(process.argv[2]?.replace(/^--port=/, "")) || 8080;

createServer(async (req, res) => {
  const path = (req.url ?? "/").split(/[?#]/)[0] || "/";
  const file = join(root, path === "/" ? "index.html" : path);
  try {
    const data = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(port, () => console.log("DealTruth at http://localhost:" + port));
