// declare module '@storybook/cli/dist/cjs/extract' {
//   export function extract(input: string, targetPath: string): Promise<void>;
// }
declare module '@storybook/cli/dist/cjs/extract' {
  export * from '@storybook/cli/dist/ts3.9/extract'
}
