declare module 'stylelint/lib/createStylelint' {
  import stylelint from 'stylelint';

  function createStylelint(
    options: Partial<stylelint.LinterOptions>
  ): {
    getConfigForFile: (path: string) => { config: stylelint.Configuration };
  };

  export default createStylelint;
}
