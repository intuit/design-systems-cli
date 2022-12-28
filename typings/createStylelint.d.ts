declare module 'stylelint/lib/createStylelint' {
  import stylelint from 'stylelint';

  function createStylelint(
    options: Partial<stylelint.LinterOptions>
  ): {
    getConfigForFile: (path: string) => { config: stylelint.Config };
  };

  export default createStylelint;
}
