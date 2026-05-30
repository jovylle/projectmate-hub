import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "site/out");

await rm(out, { recursive: true, force: true });
await mkdir(join(out, "overlay"), { recursive: true });
await mkdir(join(out, "demo"), { recursive: true });

await cp(join(root, "apps/overlay/dist"), join(out, "overlay"), { recursive: true });

let demo = await readFile(join(root, "demo/session-bridge.html"), "utf8");
demo = demo.replaceAll("../apps/overlay/dist/index.html", "./overlay/index.html");
await writeFile(join(out, "demo/session-bridge.html"), demo);

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>projectmate-hub</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.55; max-width: 40rem; }
      a { color: #4f46e5; }
      code { font-size: 0.9em; }
    </style>
  </head>
  <body>
    <h1>projectmate-hub</h1>
    <p>Community hub layer — host session bridge and overlay preview.</p>
    <ul>
      <li><a href="/overlay/">Hub overlay</a> (iframe target for <code>appUrl</code>)</li>
      <li><a href="/demo/session-bridge.html">Session bridge demo</a> (<code>PM_HOST_SESSION</code>)</li>
    </ul>
    <p><a href="https://github.com/jovylle/projectmate-hub">Repository</a></p>
  </body>
</html>
`;
await writeFile(join(out, "index.html"), indexHtml);

console.log("site/out ready:", out);
