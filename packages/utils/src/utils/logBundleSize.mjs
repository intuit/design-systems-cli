import fs from 'fs';
import path from 'path';
import brotli from 'brotli';
import { once } from 'events';
import fetch from 'node-fetch';
import dasherize from 'dasherize';
import { table } from 'table';
import markdownTable from 'markdown-table';
import Commently from 'commently';
import getPackages from 'get-monorepo-packages';
import { execSync } from 'child_process';
import gitlog from 'gitlog';

const componentsDir = `${process.cwd()}/components`;
let updatedComponents = [];
let pkgVersion = '';
let repo = 'qbds';

const tableHeader = ['Component', 'Uncompressed', 'Compressed'];

/**
 * load the production Files
 */
const loadProdFiles = async (prodVersion, fileName) => {
  const sizeData = [];

  if (prodVersion) {
    for (const component of updatedComponents) {
      const prodURL = `https://uxfabric.intuitcdn.net/@${repo}/${dasherize(
        component
      )}/${prodVersion}/${fileName}`;

      const distPath = `${componentsDir}/${component}/dist`;

      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(prodURL);

      if (res.status === 200) {
        try {
          const stream = res.body.pipe(
            fs.createWriteStream(`${distPath}/${fileName}.prod`)
          );

          // eslint-disable-next-line no-await-in-loop
          await once(stream, 'finish');

          const uncompressedFileStats = fs.statSync(
            `${distPath}/${fileName}.prod`
          );
          const compressedFile = brotli.compress(
            fs.readFileSync(`${distPath}/${fileName}.prod`)
          );

          fs.writeFileSync(`${distPath}/${fileName}.prod.br`, compressedFile);
          const compressedFileStats = fs.statSync(
            `${distPath}/${fileName}.prod.br`
          );

          sizeData.push({
            uncompressed: uncompressedFileStats.size,
            compressed: compressedFileStats.size,
            component
          });

          console.log(`${component} prod file done: ${prodURL}`);
        } catch (e) {
          console.log('prod: general error:', e);
        }
      } else {
        console.log(`prod: error: ${component}: ${prodURL}`);
        sizeData.push({
          uncompressed: 0,
          compressed: 0,
          component
        });
      }
    }
  }

  return sizeData;
};

/**
 * load the canary Files
 */
const loadTheCanaryFiles = async (prId) => {
  const sizeData = [];

  if (prId) {
    for (const component of updatedComponents) {
      const canaryURL = `https://uxfabric.intuitcdn.net/components/design-systems/${repo}/canary/${prId}/${component}/ids.js`;
      const distPath = `${componentsDir}/${component}/dist`;

      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(canaryURL);
      if (res.status === 200) {
        const stream = res.body.pipe(
          fs.createWriteStream(`${distPath}/pr-ids.js`)
        );

        // eslint-disable-next-line no-await-in-loop
        await once(stream, 'finish');

        const uncompressedFileStats = fs.statSync(`${distPath}/pr-ids.js`);
        const compressedFile = brotli.compress(
          fs.readFileSync(`${distPath}/pr-ids.js`)
        );

        fs.writeFileSync(`${distPath}/pr-ids.js.br`, compressedFile);
        const compressedFileStats = fs.statSync(`${distPath}/pr-ids.js.br`);

        sizeData.push({
          uncompressed: uncompressedFileStats.size,
          compressed: compressedFileStats.size,
          component
        });

        console.log(`${component} canary file done: ${canaryURL}`);
      } else {
        sizeData.push({
          uncompressed: 0,
          compressed: 0,
          component
        });
      }
    }
  }

  return sizeData;
};

/**
 * get the css size data
 */
const cssSizeData = () => {
  const sizeData = [];
  console.log('\nloading css data');
  console.log('----------------');

  for (const component of updatedComponents) {
    const distPath = `${componentsDir}/${component}/dist`;

    try {
      const uncompressedFileStats = fs.statSync(`${distPath}/main.css`);

      const compressedFile = brotli.compress(
        fs.readFileSync(`${distPath}/main.css`)
      );
      fs.writeFileSync(`${distPath}/main.css.br`, compressedFile);
      const compressedFileStats = fs.statSync(`${distPath}/main.css.br`);

      sizeData.push({
        uncompressed: uncompressedFileStats.size,
        compressed: compressedFileStats.size,
        component
      });
    } catch (e) {
      console.log('css file not found for ', component);

      sizeData.push({
        uncompressed: 0,
        compressed: 0,
        component
      });
    }

  }

  return sizeData;
};

/**
 * print the size data
 */
const printTheSizeData = (sizeData, title) => {
  const data = sizeData.reduce((acc, curr) => {
    acc[curr.component] = curr;
    return acc;
  }, {});

  let compressedTotal = 0;
  let uncompressedTotal = 0;

  const tableData = [[title, '', ''], tableHeader];

  Object.keys(data).forEach((key) => {
    const { uncompressed, compressed } = data[key];

    tableData.push([
      key,
      `${uncompressed / 1000} kB`,
      `${compressed / 1000} kB`
    ]);

    compressedTotal += compressed;
    uncompressedTotal += uncompressed;
  });

  tableData.push([
    'Total',
    `${uncompressedTotal / 1000} kB`,
    `${compressedTotal / 1000} kB`
  ]);
  console.log(table(tableData));
};

/**
 * print the difference between prod and canary
 */
const printTheDifference = (prodData, prData, prodDataCss, prDataCss) => {
  const prodObjectIds = prodData.reduce((acc, curr) => {
    acc[curr.component] = curr;
    return acc;
  }, {});

  const prObjectIds = prData.reduce((acc, curr) => {
    acc[curr.component] = curr;
    return acc;
  }, {});

  const prodObjectCss = prodDataCss.reduce((acc, curr) => {
    acc[curr.component] = curr;
    return acc;
  }, {});

  const prObjectCss = prDataCss.reduce((acc, curr) => {
    acc[curr.component] = curr;
    return acc;
  }, {});

  const tableData = [
    [
      '', 
      'ids.js %',
      '\u{1F5DC} - ids.js %',
      'main.css %',
      '\u{1F5DC} - main.css %',
      'token/theme %',
    ]
  ];

  Object.keys(prObjectIds).forEach((key) => {
    const { uncompressed: uncompressedPrIds, compressed: compressedPrIds } = prObjectIds[key];

    const uncompressedProd = prodObjectIds[key]?.uncompressed ? prodObjectIds[key].uncompressed : 0;
    const compressedProd = prodObjectIds[key]?.compressed ? prodObjectIds[key].compressed : 0;

    const uncompressedPrCss = prObjectCss[key]?.uncompressed ? prObjectCss[key].uncompressed : 0;
    const uncompressedProdCss = prodObjectCss[key]?.uncompressed ? prodObjectCss[key].uncompressed : 0;

    const compressedPrCss = prObjectCss[key]?.compressed ? prObjectCss[key].compressed : 0;
    const compressedProdCss = prodObjectCss[key]?.compressed ? prodObjectCss[key].compressed : 0;

    tableData.push([
      key,
      `${(100 - (uncompressedProd / uncompressedPrIds) * 100).toFixed(2)} %`,
      `${(100 - (uncompressedProdCss / uncompressedPrCss) * 100).toFixed(2)} %`,
      `${(100 - (compressedProd / compressedPrIds) * 100).toFixed(2)} %`,
      `${(100 - (compressedProdCss / compressedPrCss) * 100).toFixed(2)} %`,
      'TBD'
    ]);
  });

  console.log(`BUNDLE SIZE DIFFERENCE:\n`);
  console.log(table(tableData));

  return tableData;
};

/**
 * helper to calculate download time
 */
const calculateDownloadTime = (size) => {
  const downloadSpeeds = [];
  const threeGspeed = 50;
  const fourGspeed = 875;

  if(size) {
    const threeG = (size / 1000 / threeGspeed) >= 1 ? `${(size / 1000 / threeGspeed).toFixed(2)} s` : `${(size / 1000 / threeGspeed * 1000).toFixed(2)} ms`;
    const fourG = (size / 1000 / fourGspeed) >= 1 ? `${(size / 1000 / fourGspeed).toFixed(2)} s` : `${(size / 1000 / fourGspeed * 1000).toFixed(2)} ms`;
    downloadSpeeds.push(threeG);
    downloadSpeeds.push(fourG);
  }
  
  return downloadSpeeds;
}

/**
 * get the download times for PR and Prod
 */
const getDownloadTimes = (prData) => {
  const prObjectIds = prData.reduce((acc, curr) => {
    acc[curr.component] = curr;
    return acc;
  }, {});

  const tableData = [
    [
      '',
      'PR: 3G',
      'PR: 4G',
      'PR: 3G - \u{1F5DC}',
      'PR: 4G - \u{1F5DC}',
    ]
  ];

  Object.keys(prObjectIds).forEach((key) => {
    const { uncompressed, compressed } = prObjectIds[key];

    tableData.push([
      key,
      ...(calculateDownloadTime(uncompressed)),
      ...(calculateDownloadTime(compressed))
    ]);
  });

  console.log(`DOWNLOAD TIMES:\n`);
  console.log(table(tableData));
  return tableData;
}

/** Report the results and success/failure. */
const reportResultsToPR = async (tableOutput, downloadTimesTable) => {
  // eslint-disable-next-line no-console
  console.log(tableOutput);

  if (process.env.GH_TOKEN) {
    // eslint-disable-next-line new-cap
    const commenter = new Commently.default({
      title: 'Component Bundle Size Analysis',
      key: 'bundle-size-analysis',
      // Jenkin doesn't support owner/repo or any slug so a user must
      // provide these values themselves
      owner: process.env.OWNER,
      repo: process.env.REPO,
      useHistory: false
    });

    try {
      const comment = `${markdownTable(tableOutput)}\n\nDOWNLOAD TIMES:\n${markdownTable(downloadTimesTable)}\n\nNote: 3G = 50kB/s, 4G = 875kB/s`;
      await commenter.autoComment(comment);
    } catch (error) {
      console.error(error);
    }
  }
};

/** Determine which packages have git changes. */
function getChangedPackages(mergeBase) {
  const all = getPackages('.');

  try {
    // this assumes on master whereas we want the last tag
    const packages = execSync('lerna changed --ndjson --toposort', {
      stdio: ['pipe'],
    })
      .toString()
      .trim()
      .split('\n');
    const lastTag = execSync('git describe --tags --abbrev=0', {
      encoding: 'utf8',
    });
    // Use commit-ish hash instead of the last tag if provided
    const hash = mergeBase?.trim();
    const changedFiles = gitlog.default({
      repo: process.cwd(),
      number: Number.MAX_SAFE_INTEGER,
      fields: ['hash', 'authorName', 'authorEmail', 'rawBody'],
      execOptions: { maxBuffer: Infinity },
      branch: `${hash || lastTag.trim()}..HEAD`,
    })
      .reduce((files, commit) => [...files, ...commit.files], [])
      .map((file) => path.resolve(path.join(process.cwd(), file)));

    const changedDeps = [];

    return packages
      .map((p) => JSON.parse(p))
      .filter((json) =>
        changedFiles.some((file) => {
          const hasChangedFiles = file.includes(String(json.location));

          if (hasChangedFiles) {
            changedDeps.push(String(json.name));
          } else {
            // Check if a dep has changed too
            const packageJson = JSON.parse(
              fs.readFileSync(path.join(String(json.location), 'package.json'), {
                encoding: 'utf-8',
              })
            );
            const hasChangedDep = Object.keys(packageJson).some((dep) =>
              changedDeps.includes(dep)
            );

            if (hasChangedDep) {
              changedDeps.push(String(json.name));
              return hasChangedDep;
            }
          }

          return hasChangedFiles;
        })
      )
      .map((json) => {
        return { location: json.location, package: { ...json } };
      });
  } catch (error) {
    if (!error.message.includes('fatal: ambiguous argument')) {
      throw error;
    }

    return all;
  }
}

/** Determine which packages have git changes. */
function setInitialValues(changedPackages) {
  if(changedPackages && changedPackages.length > 0) {
    pkgVersion = changedPackages[0].package.version;
    updatedComponents = changedPackages.map((pkg) => {
      const words = pkg.package.location.split('/');
      const pkgName = words[words.length - 1];
      return pkgName;
    });

    console.log('changedPackages: ', updatedComponents);
    console.log('version: ', pkgVersion);
  }
}

/**
 * get the size data
 */
const getTheSizeData = async (prId, prodVersion) => {
  console.log('\nloading ids.js data');
  console.log('----------------');

  const localData = await loadTheCanaryFiles(prId);
  const prodData = await loadProdFiles(prodVersion, 'ids.js');

  const cssLocalData = cssSizeData();
  const cssProdData = await loadProdFiles(prodVersion, 'main.css');

  console.log('----------------\n\n');

  printTheSizeData(localData, 'Canary Data');
  printTheSizeData(prodData, 'Prod Data');

  printTheSizeData(cssLocalData, 'CSS PR Data');
  printTheSizeData(cssProdData, 'CSS Prod Data');

  const tableOutput = printTheDifference(
    prodData,
    localData,
    cssProdData,
    cssLocalData
  );

  const downloadTimesTable = getDownloadTimes(localData);

  if (process.env.GH_TOKEN && process.env.OWNER && process.env.REPO) {
    // print the results to the PR
    await reportResultsToPR(tableOutput, downloadTimesTable);
  }
};


// get the PR id from the command line
const args = process.argv.slice(2);
if (args.length > 0 && args[0]) {
  const prId = args[0];
  repo = (args[1] && args[1] === 'ids-web') ? 'ids-ts' : repo;

  console.log('prId: ', prId);
  console.log('repo: ', repo);

  const chgPkgs = getChangedPackages();

  setInitialValues(chgPkgs);
  getTheSizeData(prId, pkgVersion);
}
