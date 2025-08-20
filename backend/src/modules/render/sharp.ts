import fs from 'fs';

let sharp: any;
try {
  const moduleName = 'sharp';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  sharp = require(moduleName);
} catch {
  sharp = (input: Buffer) => ({
    png: () => ({
      async toFile(outPath: string) {
        await fs.promises.writeFile(outPath, input);
      },
    }),
  });
}

export default sharp;
