import path from 'path';

export default ({ input, output }: { input: string; output: string }) => ({
  output: path.join(process.cwd(), output),
  input: path.join(process.cwd(), input),
  url: `file://${path.join(process.cwd(), input)}`,
  concurrency: 2,
  verbose: true,
  fixPseudo: true,
  outputBy: 'kind',
  pageTitle: 'design-system',
  puppeteerOptions: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  viewports: {
    mobile: {
      width: 320,
      height: 900,
      symbolPrefix: 'Mobile/'
    },
    tablet: {
      width: 768,
      height: 900,
      symbolPrefix: 'Tablet/'
    },
    standard: {
      width: 1024,
      height: 768,
      symbolPrefix: 'Desktop/'
    },
    large: {
      width: 1440,
      height: 800,
      symbolPrefix: 'LargeDesktop/'
    }
  }
});
