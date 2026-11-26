// Hand-in program for the Marigold household budget site (Node 22,
// standard library only). It stages the site into the grader's output
// directory: the static app/ folder, the screenshots/ folder, and a
// dossier.json built from them with the vendored make.fun library.
//
// The grader runs this program twice and requires both runs to write
// identical bytes, so nothing here depends on a timestamp, a random
// value or run order. Outside the grader, set MAKEFUN_OUTPUT_DIR to a
// local directory instead of /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Clear only the paths this program owns inside the output directory.
// The output directory itself may be a mount point, so it is never
// removed — only app/, screenshots/ and dossier.json are replaced.
for (const name of ["app", "screenshots", "dossier.json"]) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

// The whole static site, exactly as it sits in the repository.
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });

// The screenshots, in the same order the dossier lists them.
const shotsDir = join(repoRoot, "screenshots");
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

// The dossier must be byte for byte what the scorer's own copy of the
// library writes, so the options match the gate's caps: text capped at
// 160 KiB, at most 4 screenshots of 256 KiB each, app/ within its
// 993-file / 16 MiB limits.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
