const { existsSync } = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const candidates = [
  path.resolve(process.cwd(), "../patch-package/index.js"),
  path.resolve(process.cwd(), "node_modules/patch-package/index.js"),
  path.resolve(__dirname, "../../node_modules/patch-package/index.js"),
  path.resolve(__dirname, "../node_modules/patch-package/index.js"),
];

const patchPackagePath = candidates.find((candidate) => existsSync(candidate));

if (!patchPackagePath) {
  console.warn("[postinstall] patch-package not found, skipping patch application.");
  process.exit(0);
}

const result = spawnSync(process.execPath, [patchPackagePath], {
  stdio: "inherit",
  cwd: process.cwd(),
  env: process.env,
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
