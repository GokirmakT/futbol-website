import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(projectRoot, "public");
const logosRoot = path.join(publicRoot, "logos");
const outputPath = path.join(projectRoot, "src", "Components", "teamLogoAssets.js");

async function collectLogoPaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      paths.push(...await collectLogoPaths(entryPath));
      continue;
    }

    if (!/\.(png|jpe?g|webp|svg)$/i.test(entry.name) || entry.name.toLowerCase() === "disabled.png") {
      continue;
    }

    const relativePath = path.relative(publicRoot, entryPath).split(path.sep).join("/");
    paths.push(`/${relativePath}`);
  }

  return paths;
}

const logoPaths = (await collectLogoPaths(logosRoot)).sort((left, right) => left.localeCompare(right));
const generatedModule = `export const teamLogoAssetPaths = ${JSON.stringify(logoPaths, null, 2)};\n`;

await writeFile(outputPath, generatedModule, "utf8");
console.log(`Generated logo manifest with ${logoPaths.length} assets.`);