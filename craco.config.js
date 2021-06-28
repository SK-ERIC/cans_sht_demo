/**
 * TODO: 区分环境 —— NODE_ENV
 * - whenDev ☞ process.env.NODE_ENV === 'development'
 * - whenTest ☞ process.env.NODE_ENV === 'test'
 * - whenProd ☞ process.env.NODE_ENV === 'production'
 */
const { whenDev, whenProd } = require('@craco/craco');

const CracoAlias = require('craco-alias');
const CracoAntDesignPlugin = require('craco-antd');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const FastRefreshCracoPlugin = require('craco-fast-refresh');

const path = require('path');

module.exports = {
  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
      ...whenProd(
        () => [
          new TerserPlugin({
            // sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
              ecma: undefined,
              parse: {},
              compress: {
                warnings: false,
                drop_console: true, // 生产环境下移除控制台所有的内容
                drop_debugger: true, // 移除断点
                pure_funcs: ['console.log'] // 生产环境下移除console
              }
            }
          })
        ],
        []
      )
    ],
    configure(webpackConfig, { env, paths }) {
      paths.appBuild = 'build';
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, 'build'),
        publicPath: '/'
      };
      return webpackConfig;
    }
  },
  babel: {
    plugins: [
      ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }, 'antd'],
      // ["@babel/plugin-proposal-decorators", { legacy: true }], // 用来支持装饰器
      ['react-hot-loader/babel']
    ]
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './src',
        tsConfigPath: './tsconfig.extend.json'
      }
    },
    ...whenDev(
      () => [
        {
          plugin: FastRefreshCracoPlugin
        }
      ],
      []
    ),
    // 配置Antd主题
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, 'antd.customize.less'),
      }
    }
  ],
  devServer: {
    port: 9000,
    proxy: {}
  }
};
