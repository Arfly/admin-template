const vuePlugin = require('esbuild-vue')
const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  outfile: 'out.js',
  plugins: [vuePlugin()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('development')
  }
})
