// Bargain Beacon hand-in: copies the finished site (app/) and its screenshots into
// the output directory, then writes the dossier the gate compares byte for byte.
// Node 22, standard library only. The dossier comes from the vendored make.fun
// library, which must stay exactly as the kit shipped it.
//
// The grader runs this program twice and requires identical bytes both times; it
// only copies files and hashes them, so the output is deterministic by construction.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Caps from the gate, passed exactly as the kit's starter passes them, so the
// dossier this writes is the one the gate rebuilds and compares against.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);
