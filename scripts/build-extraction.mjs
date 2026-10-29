import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
await mkdir('server-bundles', { recursive: true });
for (const name of ['pdf-server', 'docx-server']) {
  await build({
    entryPoints: [`src/lib/boq-import/${name}.ts`],
    outfile: `server-bundles/${name}.mjs`,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    bundle: true,
    packages: 'external',
    sourcemap: false,
    logLevel: 'warning',
  });
}
