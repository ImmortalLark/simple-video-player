const lessPlugin = require('esbuild-plugin-less');
const { lessLoader } = lessPlugin;

const BaseConfig = {
  entryPoints: ['./src/index.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
  plugins: [lessLoader()],
};

module.exports = BaseConfig;