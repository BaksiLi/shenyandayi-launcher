import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = path.join(root, "build", "raycast");
const staging = path.join(root, "build", "raycast-staging");
const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const english = await readJson(path.join(root, "src", "ui-text.json"));

function validateInterface(reference, candidate, location = "ui") {
  if (
    !candidate ||
    typeof candidate !== "object" ||
    Object.keys(reference).sort().join() !==
      Object.keys(candidate).sort().join()
  ) {
    throw new Error(`Interface keys differ at ${location}`);
  }
  for (const [key, value] of Object.entries(reference)) {
    if (typeof value === "string") {
      if (typeof candidate[key] !== "string" || !candidate[key].trim()) {
        throw new Error(`Missing interface text at ${location}.${key}`);
      }
    } else {
      validateInterface(value, candidate[key], `${location}.${key}`);
    }
  }
}

for (const locale of ["zh-Hant", "zh-Hans"]) {
  validateInterface(
    english,
    await readJson(path.join(root, "src", "locales", `${locale}.json`)),
  );
}
const manifest = await readJson(path.join(root, "package.json"));
const overrides = await readJson(
  path.join(root, "variants", "raycast", "manifest.json"),
);
const exported = { ...manifest, ...overrides };
delete exported.scripts["prepare:raycast"];
exported.scripts["format:check"] =
  "prettier --check src package.json tsconfig.json eslint.config.mjs";

await mkdir(path.dirname(staging), { recursive: true });
await rm(staging, { recursive: true, force: true });
for (const entry of [
  "src",
  "assets",
  "package-lock.json",
  "tsconfig.json",
  "eslint.config.mjs",
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
]) {
  await cp(path.join(root, entry), path.join(staging, entry), {
    recursive: true,
    filter: (source) => path.basename(source) !== "compiled_raycast_swift",
  });
}
await cp(
  path.join(root, "swift", "Sources"),
  path.join(staging, "swift", "Sources"),
  {
    recursive: true,
  },
);
for (const file of ["Package.swift", "Package.resolved"]) {
  await cp(path.join(root, "swift", file), path.join(staging, "swift", file));
}
await cp(
  path.join(root, "variants", "raycast", "README.md"),
  path.join(staging, "README.md"),
);
await cp(
  path.join(root, "variants", "raycast", "CHANGELOG.md"),
  path.join(staging, "CHANGELOG.md"),
);
await writeFile(
  path.join(staging, "package.json"),
  `${JSON.stringify(exported, null, 2)}\n`,
);
await rm(path.join(staging, "src", "locales"), {
  recursive: true,
  force: true,
});
await cp(
  path.join(root, "variants", "raycast", "ui.ts"),
  path.join(staging, "src", "ui.ts"),
);
await rm(destination, { recursive: true, force: true });
await rename(staging, destination);
console.log(`Prepared English Raycast source: ${destination}`);
console.log(
  "Not submitted. See RAYCAST_SUBMISSION.md for remaining requirements.",
);
