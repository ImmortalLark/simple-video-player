const esbuild = require('esbuild');
const config = require('./config');

config.outdir = 'www/js';

(async () => {

  const ctx = await esbuild.context({
    ...config,
    outdir: 'www',
  });

  await esbuild.build({
    ...config,
    outdir: './www'
  });

  const { port } = await ctx.serve({
    servedir: 'www',
  });
  console.log(`DEV server has been started on port ${port}`);
})();