declare module '@storybook/react/standalone' {
  interface StorybookArgs {
    mode: string;
    port?: number;
    configDir: string;
    outputDir?: string;
    ci?: boolean;
  }
  function storybook(args: StorybookArgs): void;

  export = storybook;
}
