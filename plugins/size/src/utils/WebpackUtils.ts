import { createLogger } from '@design-systems/cli-utils'
import webpack from 'webpack'
import path from 'path'
import fs from 'fs-extra'
import getExports from '@royriojas/get-exports-from-file'
import { camelCase } from 'change-case'
import InjectPlugin from 'webpack-inject-plugin'
import Terser from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import { getMonorepoRoot, getLogLevel } from '@design-systems/cli-utils'
import { execSync, ExecSyncOptions } from 'child_process'
import RelativeCommentsPlugin from '../RelativeCommentsPlugin'
import { fromEntries } from './formatUtils'
import { ConfigOptions, GetSizesOptions, CommonOptions } from '../interfaces'
import { mockPackage } from './CalcSizeUtils'

const logger = createLogger({ scope: 'size' })

/** Generate webpack config. */
const config = async ({
  dir,
  name,
  importName,
  analyze,
  analyzerPort,
  chunkByExport,
  diff
}: ConfigOptions & CommonOptions & GetSizesOptions) => {
  const isLocal = name[0] !== '@'
  const js = isLocal ? name : path.join(dir, 'node_modules', name)
  const packageJsonPath = isLocal
    ? path.join(name, 'package.json')
    : path.join(dir, 'node_modules', name, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const cssFile = path.join(name, 'dist/main.css')
  const css = isLocal ? cssFile : path.join(dir, 'node_modules', cssFile)
  const peers = Object.keys(packageJson.peerDependencies || {})
  const jsPath = require.resolve(js)
  const { exported } = await getExports.es6(jsPath.replace('cjs', 'esm'))
  const { exported: cjsExports } = await getExports.cjs(jsPath)
  const allExports = exported.length ? exported : cjsExports
  logger.debug(`Using JS file: ${jsPath}`)
  logger.debug(`Using CSS file: ${css}`)
  logger.debug('Found exported:\n', allExports)
  const plugins: webpack.Plugin[] = []
  const entry = fromEntries(
    chunkByExport
      ? allExports.map(e => {
          const content = e.default
            ? `export { default as ${camelCase(e.name)} } from "${importName}";`
            : `export { ${e.name} } from "${importName}";`
          plugins.push(new InjectPlugin(() => content, { entryName: e.name }))
          // This is the actual package "undefined"
          return [e.name, [path.join(__dirname, 'undefined.js')]]
        })
      : [['js', [js]]]
  )
  if (fs.existsSync(css)) {
    entry.css = [css]
  }

  logger.debug('Webpack Entry Files:\n', entry)
  return {
    devtool: false,
    mode: 'production',
    entry,
    output: {
      path: dir
    },
    externals: [
      /^react(-dom)?$/,
      fromEntries(
        Object.keys(packageJson.peerDependencies || {}).map(c => [c, c])
      ),
      /*
       * We need to account for peer dependency sub-paths since webpack does
       * not handle this for us.
       *
       * EX:
       * externals: { "@fuego/gsap-premium": "@fuego/gsap-premium" }
       * will not externalize the following path
       * import "@fuego/gsap-premium/CssPlugin"
       *
       * so this function aims to exclude any sub-path.
       */
      function (context, request, callback) {
        if (peers.find(peer => request.startsWith(`${peer}/`))) {
          logger.debug(`Externalizing: ${request}`)
          return callback(null, JSON.stringify(request))
        }

        callback(undefined, undefined)
      }
    ],
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin()]
    },
    module: {
      rules: [
        // https://github.com/apollographql/react-apollo/issues/1737#issuecomment-372946515
        {
          type: 'javascript/auto',
          test: /\.mjs$/,
          use: []
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      analyze && new BundleAnalyzerPlugin({ analyzerPort }),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      ...plugins,
      diff
        ? new RelativeCommentsPlugin({ importName })
        : new Terser({
            extractComments: false,
            cache: true,
            parallel: true,
            sourceMap: false,
            terserOptions: {
              output: {
                comments: false
              }
            }
          })
    ].filter(Boolean)
  } as webpack.Configuration
}

/** run webpack */
// eslint-disable-next-line no-shadow
async function runWebpack (
  config: webpack.Configuration
): Promise<webpack.Stats> {
  return new Promise((resolve, reject) => {
    try {
      const compiler = webpack(config)
      compiler.run((err, stats) => {
        if (err) return reject(err)
        return resolve(stats)
      })
    } catch (error) {
      logger.error('Something went wrong!')
      logger.error(error)
      logger.trace('Webpack Configuration:\n', config)
    }
  })
}

/** Install package to tmp dir and run webpack on it to calculate size. */
async function getSizes (options: GetSizesOptions & CommonOptions) {
  const dir = mockPackage()
  const execOptions: ExecSyncOptions = {
    cwd: dir,
    stdio: getLogLevel() === 'trace' ? 'inherit' : 'ignore'
  }
  try {
    const browsersList = path.join(getMonorepoRoot(), '.browserslistrc')
    if (fs.existsSync(browsersList)) {
      fs.copyFileSync(browsersList, path.join(dir, '.browserslistrc'))
    }

    logger.debug(`Installing: ${options.name}`)
    if (options.registry) {
      execSync(
        `yarn add ${options.name} --registry ${options.registry}`,
        execOptions
      )
    } else {
      execSync(`yarn add ${options.name}`, execOptions)
    }
  } catch (error) {
    logger.debug(error)
    logger.warn(`Could not find package ${options.name}...`)
    return []
  }

  const result = await runWebpack(
    await config({
      dir,
      ...options
    })
  )
  logger.debug(`Completed building: ${dir}`)
  if (options.persist) {
    const folder = `bundle-${options.scope}`
    const out = path.join(process.cwd(), folder)
    logger.info(`Persisting output to: ${folder}`)
    await fs.remove(out)
    await fs.copy(dir, out)
    await fs.writeFile(`${out}/stats.json`, JSON.stringify(result.toJson()))
    await fs.writeFile(
      `${out}/.gitignore`,
      'node_modules\npackage.json\npackage-lock.json\nstats.json'
    )
    execSync('git init', { cwd: out })
    execSync('prettier --single-quote "**/*.{css,js}" --write', { cwd: out })
    execSync('git add .', { cwd: out })
    execSync('git commit -m "init"', { cwd: out })
  }

  fs.removeSync(dir)
  if (result.hasErrors()) {
    throw new Error(result.toString('errors-only'))
  }

  const { assets } = result.toJson()
  if (!assets) {
    return []
  }

  return assets
}

/** Start the webpack bundle analyzer for both of the bundles. */
async function startAnalyze (name: string, registry?: string) {
  logger.start('Analyzing build output...')
  await Promise.all([
    getSizes({
      name,
      importName: name,
      scope: 'master',
      analyze: true,
      registry
    }),
    getSizes({
      name: process.cwd(),
      importName: name,
      scope: 'pr',
      analyze: true,
      analyzerPort: 9000,
      registry
    })
  ])
}

export { startAnalyze, runWebpack, config, getSizes }
