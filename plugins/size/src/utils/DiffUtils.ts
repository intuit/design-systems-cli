import {
    monorepoName,
    createLogger} from '@design-systems/cli-utils';
import Diff2Html from 'diff2html';
const logger = createLogger({ scope: 'size' });
import { execSync } from 'child_process';
import fs from 'fs-extra';
import opn from 'opn';

/** Open a html git diff of the two bundles. */
function createDiff() {
    logger.start('Creating diff of build output...');
  
    execSync('git remote add pr ../bundle-pr && git fetch pr', {
      cwd: 'bundle-master',
      stdio: 'ignore'
    });
  
    const diff = execSync(
      "git --no-pager diff master pr/master -- ':!package-lock.json' ':!yarn.lock'",
      {
        cwd: 'bundle-master'
      }
    ).toString();
  
    if (!diff) {
      logger.success('No differences found in bundles!');
      return;
    }
  
    const outputHtml = Diff2Html.html(diff, {
      drawFileList: true,
      matching: 'lines',
      outputFormat: 'side-by-side'
    });
  
    fs.writeFileSync(
      'diff.html',
      `
        <html>
          <head>
            <!-- CSS -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github.min.css">
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/diff2html@2.7.0/dist/diff2html.css">
  
            <!-- Javascripts -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/languages/css.min.js"></script>
  
            <script type="text/javascript" src="https://unpkg.com/diff2html@2.7.0/dist/diff2html.js"></script>
            <script type="text/javascript" src="https://unpkg.com/diff2html@2.7.0/dist/diff2html-ui.js"></script>
            <style>
              .d2h-files-diff {
                height: inherit;
              }
              
              .d2h-file-side-diff {
                margin-bottom: -4px;
              }
            </style>
          </head>
          <body id="main" style="font-family: Roboto,sans-serif;">
            ${outputHtml}
          </body>
          <script>
            $(document).ready(function() {
              var diff2htmlUi = new Diff2HtmlUI();
              diff2htmlUi.highlightCode('#main');
              diff2htmlUi.fileListCloseable('#main', true);
            });
          </script>
        </html>
      `
    );
  
    opn('diff.html', { wait: false }).then(() =>
      logger.info('Diff opened in browser!')
    );
  }

export { createDiff } 