/* eslint-disable */
import legacyPlugin from '@vitejs/plugin-legacy'
import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from "rollup-plugin-visualizer"
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import postCssPxToRem from "postcss-pxtorem"
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, './.env.local'), // 配置文件路径
  encoding: 'utf8', // 编码方式，默认utf8
  debug: false, // 是否开启debug，默认false
})
// @see https://cn.vitejs.dev/config/
export default ({ command, mode }) => {
  let rollupOptions = {}

  let optimizeDeps = {}

  let alias = {
    '@': path.resolve(__dirname, 'src'),
    vue$: 'vue/dist/vue.runtime.esm-bundler.js'
  }

  let proxy = {
    '/api-proxy': {
      target: process.env.SERVICE_HOST,
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api-proxy/, '')
    }
  }

  // todo 替换为原有变量
  let define = {
    'process.env': {}
  }

  let esbuild = {}

  return {
    'process.env.NODE_ENV': command === 'serve' ? '"development"' : '"production"',
    'process.env.VUE_APP_ENV': '"development"',
    'process.env.VUE_APP_PUBLIC_PATH': '"/"',
    base: '/user-centre/', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias
    },
    define: define,
    server: {
      // 代理
      proxy
    },
    build: {
      minify: 'esbuild', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      outDir: 'dist', // 产出目录
      rollupOptions
    },
    esbuild,
    optimizeDeps,
    plugins: [
      legacyPlugin({
        targets: ['Android > 39', 'Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15']
      }),
      vuePlugin(),
      vueJsx(),
      visualizer(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), './src/assets/icons/')],
        // Specify symbolId format
        symbolId: 'icon-[name]',
      }),
      AutoImport({
        resolvers: [ElementPlusResolver({
          importStyle: false
        })],
      }),
      Components({
        resolvers: [ElementPlusResolver({
          importStyle: false
        })],
      }),
    ],
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 16, // 1rem的大小
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
          })
        ]
      },
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true
        }
      }
    }
  }
}
